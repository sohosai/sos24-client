import { useForm } from "react-hook-form";
import { UpdateUserSchema, UpdateUserSchemaType, userRoles } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { hstack, stack } from "@styled-system/patterns";
import { css, cx } from "@styled-system/css";
import { Button } from "@/common_components/Button";
import Image from "next/image";
import sendIcon from "@/assets/SendButton.svg?url";
import useSWR from "swr";
import { assignType, client } from "@/lib/openapi";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UserRoleFormatter } from "@/common_components/user/UserRoleFormatter";
import { components } from "@/schema";
import { basicFormStyle, basicErrorMessageStyle } from "@/common_components/formFields/styles";

let labelAndInputStyle = css({
  display: "flex",
  flexDir: "column",
  gap: "6px",
  width: "100%",
});

export const EditUserForm: FC<{
  user_id: string;
}> = ({ user_id }) => {
  const router = useRouter();
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserSchemaType>({
    mode: "onBlur",
    resolver: valibotResolver(UpdateUserSchema),
  });

  const { data, error, isLoading } = useSWR(`/users/${user_id}`);
  if (isLoading) {
    return;
  }
  if (error) {
    switch (error.name) {
      case "user/not-found":
        return <p>このユーザーは存在しません。</p>;
      default:
        return <p>ユーザーの読み込み中に不明なエラーが発生しました。</p>;
    }
  }

  const user = assignType("/users/{user_id}", data);

  if (!isFormInitialized) {
    setIsFormInitialized(true);
    reset({
      name: user.name,
      kana_name: user.kana_name,
      phone_number: user.phone_number,
      email: user.email,
      role: user.role,
    });
  }

  const onSubmit = async (data: UpdateUserSchemaType) => {
    toast.promise(
      client
        .PUT(`/users/{user_id}`, {
          params: { path: { user_id: user_id } },
          body: {
            name: data.name,
            kana_name: data.kana_name,
            phone_number: data.phone_number,
            email: data.email,
            role: data.role as components["schemas"]["UserRole"],
          },
        })
        .then(({ error }) => {
          if (error) {
            throw error;
          }
          router.push(`/committee/users/${user_id}`);
        }),
      {
        loading: "ユーザーを保存しています",
        success: "ユーザーを保存しました",
        error: "ユーザーの保存中にエラーが発生しました",
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={stack({ gap: 4 })}>
      <div
        className={hstack({
          justifyContent: "space-between",
          marginBottom: 2,
        })}>
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>ユーザー編集</h2>
        <Button
          type="submit"
          color="purple"
          className={hstack({
            gap: 3,
          })}>
          <span
            className={css({
              fontSize: "xs",
              fontWeight: "bold",
            })}>
            保存
          </span>
          <Image src={sendIcon} alt="" />
        </Button>
      </div>
      <div className={labelAndInputStyle}>
        <label htmlFor="name" className={css({ fontWeight: "bold" })}>
          名前
        </label>
        <input
          type="text"
          id="name"
          placeholder="嘉納治五郎"
          className={cx(basicFormStyle(), "mask-me")}
          {...register("name")}
        />
        {errors.name && <span className={basicErrorMessageStyle}>{errors.name.message}</span>}
      </div>
      <div className={labelAndInputStyle}>
        <label htmlFor="kana_name" className={css({ fontWeight: "bold" })}>
          なまえ
        </label>
        <input
          type="text"
          id="kana_name"
          placeholder="かのうじごろう"
          className={cx(basicFormStyle(), "mask-me")}
          {...register("kana_name")}
        />
        {errors.kana_name && <span className={basicErrorMessageStyle}>{errors.kana_name.message}</span>}
      </div>
      <div className={labelAndInputStyle}>
        <label htmlFor="email" className={css({ fontWeight: "bold" })}>
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          placeholder="xxxx@x.tsukuba.ac.jp"
          className={cx(basicFormStyle(), "mask-me")}
          {...register("email")}
        />
        <span className={css({ fontSize: "sm", color: "gray.600" })}>tsukuba.ac.jpで終わるものを入力してください</span>
        {errors.email && <span className={basicErrorMessageStyle}>{errors.email.message}</span>}
      </div>
      <div className={labelAndInputStyle}>
        <label htmlFor="phone_number" className={css({ fontWeight: "bold" })}>
          電話番号
        </label>
        <input type="tel" id="phone_number" className={cx(basicFormStyle(), "mask-me")} {...register("phone_number")} />
        {errors.phone_number && <span className={basicErrorMessageStyle}>{errors.phone_number.message}</span>}
      </div>
      <div className={labelAndInputStyle}>
        <label htmlFor="role" className={css({ fontWeight: "bold" })}>
          権限
        </label>
        <select id="role" className={basicFormStyle()} {...register("role")}>
          {userRoles.map((role) => (
            <option key={role} value={role}>
              <UserRoleFormatter role={role as components["schemas"]["UserRole"]} />
            </option>
          ))}
        </select>
        {errors.role && <span className={basicErrorMessageStyle}>{errors.role.message}</span>}
      </div>
    </form>
  );
};
