"use client";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import * as Sentry from "@sentry/nextjs";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { css, cx } from "@styled-system/css";
import { basicErrorMessageStyle, basicFormStyle } from "@/common_components/formFields/styles";
import { buttonStyle } from "@/recipes/button";

type SignInInput = { email: string; password: string };

let labelAndInputStyle = css({
  display: "flex",
  flexDir: "column",
  gap: "6px",
});

export const SigninForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<SignInInput>();

  const onSubmit = async (data: SignInInput) => {
    const auth = getAuth();
    toast.promise(
      (async () => {
        const { user } = await signInWithEmailAndPassword(auth, data.email, data.password);
        Sentry.setUser({ id: user.uid });
        reset();
      })(),
      {
        loading: "サインインしています",
        success: "サインインしました",
        error: (error) => {
          Sentry.captureMessage(
            `Failed to sign in: ${error.code}`,
            error.code === "auth/invalid-credential" ? "log" : "info",
          );
          setError("root", { message: "サインインできませんでした" });
          return "サインインできませんでした";
        },
      },
    );
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={css({
          display: "flex",
          flexDir: "column",
          gap: 8,
          width: 72,
        })}>
        <div className={labelAndInputStyle}>
          <label htmlFor="email" className={css({ fontWeight: "bold" })}>
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "メールアドレスを入力してください",
              pattern: {
                value: /.*@.*\.tsukuba\.ac\.jp$/,
                message: "筑波大学のメールアドレスを入力してください",
              },
            })}
            className={cx(basicFormStyle({ isInvalid: !!errors.email }), css(), "mask-me")}
            aria-invalid={errors.email ? "true" : "false"}
            placeholder="xxxxxx@xxxx.tsukuba.ac.jp"
          />
          {errors.email && <span className={basicErrorMessageStyle}>{errors.email.message}</span>}
        </div>
        <div className={labelAndInputStyle}>
          <label htmlFor="password" className={css({ fontWeight: "bold" })}>
            パスワード
          </label>
          <input
            type="password"
            id="password"
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password", {
              required: "パスワードを入力してください",
            })}
            className={cx(basicFormStyle({ isInvalid: !!errors.password }), "mask-me")}
          />
          {errors.password && <span className={basicErrorMessageStyle}>{errors.password.message}</span>}
          {errors.root && <span className={basicErrorMessageStyle}>{errors.root.message}</span>}
        </div>
        <button
          type="submit"
          className={cx(
            buttonStyle({
              color: "purple",
              visual: "solid",
            }),
            css({ flexGrow: 0, alignSelf: "center" }),
          )}>
          送信
        </button>
      </form>
    </>
  );
};
