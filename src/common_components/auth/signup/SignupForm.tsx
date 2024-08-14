"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { css, cx } from "@styled-system/css";
import { basicErrorMessageStyle, basicFormStyle, checkboxFormStyle } from "@/common_components/formFields/styles";
import { Button } from "@/common_components/Button";
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { SignupSchema, SignupSchemaType } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Dispatch, SetStateAction } from "react";

let labelAndInputStyle = css({
  display: "flex",
  flexDir: "column",
  gap: "6px",
  width: "100%",
});

interface SignupFormProps {
  setUserEmail: Dispatch<SetStateAction<string | null>>;
}

export const SignupForm: React.FC<SignupFormProps> = ({ setUserEmail }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupSchemaType>({
    resolver: valibotResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupSchemaType) => {
    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          kana_name: data.kana_name,
          phone_number: data.phone_number,
          email: data.email,
          password: data.password,
        }),
      }).then((res) => {
        if (res.status === 201) {
          const auth = getAuth();
          signInWithEmailAndPassword(auth, data.email, data.password).then(() => {
            setUserEmail(data.email);
            sendEmailVerification(auth.currentUser!);
          });
        } else {
          setError("root", { message: "ユーザ登録に失敗しました" });
          throw new Error("ユーザ登録に失敗しました");
        }
      }),
      {
        loading: "登録中...",
        success: "登録に成功しました",
        error: "ユーザー登録に失敗しました",
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={css({
        display: "flex",
        flexDir: "column",
        alignItems: "center",
        gap: 4,
        width: 80,
      })}>
      <div className={labelAndInputStyle}>
        <label htmlFor="name" className={css({ fontWeight: "bold" })}>
          名前
        </label>
        <input type="text" id="name" placeholder="嘉納治五郎" className={cx(basicFormStyle())} {...register("name")} />
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
          className={cx(basicFormStyle())}
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
          className={cx(basicFormStyle())}
          {...register("email")}
        />
        <span className={css({ fontSize: "sm", color: "gray.600" })}>tsukuba.ac.jpで終わるものを入力してください</span>
        {errors.email && <span className={basicErrorMessageStyle}>{errors.email.message}</span>}
      </div>
      <div className={labelAndInputStyle}>
        <label htmlFor="password" className={css({ fontWeight: "bold" })}>
          パスワード
        </label>
        <input type="password" id="password" className={cx(basicFormStyle())} {...register("password")} />
        <span className={css({ fontSize: "sm", color: "gray.600" })}>6字以上で入力してください</span>
        {errors.password && <span className={basicErrorMessageStyle}>{errors.password.message}</span>}
      </div>
      <div className={labelAndInputStyle}>
        <label htmlFor="phone_number" className={css({ fontWeight: "bold" })}>
          電話番号
        </label>
        <input type="tel" id="phone_number" className={cx(basicFormStyle())} {...register("phone_number")} />
        <span className={css({ fontSize: "sm", color: "gray.600" })}>ハイフンを抜いて数字のみで入力してください</span>
        {errors.phone_number && <span className={basicErrorMessageStyle}>{errors.phone_number.message}</span>}
      </div>
      <div className={css({ display: "flex", alignItems: "center", gap: 3 })}>
        <input type="checkbox" id="agreement" className={checkboxFormStyle} {...register("agreement")} />
        <label htmlFor="agreement">
          <a
            href="https://s3.isk01.sakurastorage.jp/sos24-prod/雙峰祭オンラインシステム利用規約.pdf"
            className={css({ textDecoration: "underline" })}
            target="_blank"
            rel="noopener noreferrer">
            利用規約
          </a>
          に同意する
        </label>
      </div>
      {errors.agreement && <span className={basicErrorMessageStyle}>{errors.agreement.message}</span>}
      {errors.root && <span className={basicErrorMessageStyle}>{errors.root.message}</span>}
      <Button color="purple" className={css({ alignSelf: "center" })} type="submit">
        送信
      </Button>
    </form>
  );
};
