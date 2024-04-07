"use client";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FirebaseError } from "firebase/app";
import { css, cx } from "@styled-system/css";
import {
  basicErrorMessageStyle,
  basicFormStyle,
} from "@/_common_components/forms/styles";
import { Button } from "@/_common_components/Button";

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
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      reset();
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError("root", { message: "サインインできませんでした" });
        toast.error("サインインできませんでした");
        return;
      }
    }
  };

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={css({
          display: "flex",
          flexDir: "column",
          gap: 8,
          width: 72,
        })}
      >
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
            className={cx(basicFormStyle({ isInvalid: !!errors.email }), css())}
            aria-invalid={errors.email ? "true" : "false"}
            placeholder="xxxxxx@xxxx.tsukuba.ac.jp"
          />
          {errors.email && (
            <span className={basicErrorMessageStyle}>
              {errors.email.message}
            </span>
          )}
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
            className={cx(basicFormStyle({ isInvalid: !!errors.password }))}
          />
          {errors.password && (
            <span className={basicErrorMessageStyle}>
              {errors.password.message}
            </span>
          )}
          {errors.root && (
            <span className={basicErrorMessageStyle}>
              {errors.root.message}
            </span>
          )}
        </div>
        <Button
          type="submit"
          color="primary"
          className={css({ flexGrow: 0, alignSelf: "center" })}
        >
          送信
        </Button>
      </form>
    </>
  );
};
