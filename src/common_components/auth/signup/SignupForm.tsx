"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { css, cx } from "@styled-system/css";
import { basicErrorMessageStyle, basicFormStyle, checkboxFormStyle } from "@/common_components/formFields/styles";
import { Button } from "@/common_components/Button";
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { SignupSchema, SignupSchemaType } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";

let labelAndInputStyle = css({
  display: "flex",
  flexDir: "column",
  gap: "6px",
  width: "100%",
});

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupSchemaType>({
    resolver: valibotResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupSchemaType) => {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users`, {
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
    });

    if (resp.status === 201) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, data.email, data.password).then(() => {
        sendEmailVerification(auth.currentUser!);
      });
    } else {
      setError("root", { message: "ユーザ登録に失敗しました" });
      toast.error("ユーザ登録に失敗しました");
    }
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
        {errors.password && <span className={basicErrorMessageStyle}>{errors.password.message}</span>}
      </div>
      <div className={labelAndInputStyle}>
        <label htmlFor="phone_number" className={css({ fontWeight: "bold" })}>
          電話番号
        </label>
        <input type="tel" id="phone_number" className={cx(basicFormStyle())} {...register("phone_number")} />
        {errors.phone_number && <span className={basicErrorMessageStyle}>{errors.phone_number.message}</span>}
      </div>
      <div className={css({ display: "flex", alignItems: "center", gap: 3 })}>
        <input type="checkbox" id="agreement" className={checkboxFormStyle} {...register("agreement")} />
        <label htmlFor="agreement">利用規約に同意する</label>
      </div>
      {errors.agreement && <span className={basicErrorMessageStyle}>{errors.agreement.message}</span>}
      {errors.root && <span className={basicErrorMessageStyle}>{errors.root.message}</span>}
      <Button color="purple" className={css({ alignSelf: "center" })} type="submit">
        送信
      </Button>
    </form>
  );
};
