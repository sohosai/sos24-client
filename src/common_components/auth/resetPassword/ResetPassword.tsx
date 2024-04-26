import { basicErrorMessageStyle, basicFormStyle } from "@/common_components/formFields/styles";
import { buttonStyle } from "@/recipes/button";
import { css, cx } from "@styled-system/css";
import { center, vstack } from "@styled-system/patterns";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Image from "next/image";
import Triangle from "@/assets/Triangle.svg?url";
import { useSetAtom } from "jotai";
import { authModeAtom } from "@/common_components/auth/AuthUI";
const ResetPasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();
  const [isSent, setIsSent] = useState(false);
  const onSubmit = (data: { email: string }) => {
    toast.promise(sendPasswordResetEmail(getAuth(), data.email), {
      loading: "メールを送信しています",
      success: () => {
        setIsSent(true);
        return "メールを送信しました";
      },
      error: "メールの送信に失敗しました",
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={vstack({ justifyContent: "center", gap: 3, width: 72 })}>
      <label className={css({ width: "full" })}>
        <span className={css({ fontWeight: "bold" })}>メールアドレス</span>
        <input
          type="email"
          className={cx(basicFormStyle(), css({ width: "full" }))}
          aria-invalid={errors.email ? "true" : "false"}
          placeholder="xxxxxx@xxxx.tsukuba.ac.jp"
          {...register("email", {
            required: "メールアドレスを入力してください",
            pattern: {
              value: /.*@.*\.tsukuba\.ac\.jp$/,
              message: "筑波大学のメールアドレスを入力してください",
            },
          })}
        />
        {errors.email && <span className={basicErrorMessageStyle}>{errors.email.message}</span>}
        {errors.root && <span className={basicErrorMessageStyle}>{errors.root.message}</span>}
      </label>
      <button
        type="submit"
        disabled={isSent}
        className={cx(
          buttonStyle({ visual: "solid", color: "purple" }),
          css({
            _disabled: {
              opacity: 0.5,
              cursor: "default",
              "&:hover": { opacity: 0.5 },
            },
          }),
        )}>
        送信
      </button>
      {isSent && <p className={css({ textAlign: "center" })}>メールを送信しました。受信トレイをご確認ください</p>}
    </form>
  );
};

export const ResetPassword: React.FC = () => {
  const setAuthMode = useSetAtom(authModeAtom);
  return (
    <div
      className={center({
        minHeight: "calc(100vh - token(spacing.20))",
      })}>
      <main
        className={vstack({
          boxShadow: "token(shadows.md)",
          paddingY: 11,
          paddingX: 20,
          borderRadius: "token(xl)",
          width: "fit-content",
          verticalAlign: "center",
          maxWidth: "90%",
        })}>
        <h1 className={css({ fontSize: "2xl", fontWeight: "bold", marginBottom: 8 })}>パスワードのリセット</h1>
        <ResetPasswordForm />
        <div className={css({ marginTop: 4, display: "flex", gap: 3.5 })}>
          <Image src={Triangle} alt="" />
          <button
            onClick={() => setAuthMode("signIn")}
            className={css({
              textDecoration: "underline",
              fontWeight: "bold",
              cursor: "pointer",
            })}>
            サインイン
          </button>
        </div>
      </main>
    </div>
  );
};
