"use client";

import { useAuthState } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useForm } from "react-hook-form";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";

type SigninInput = { email: string; password: string };

export const SigninForm: React.FC = () => {
  const { user, isLoading } = useAuthState();
  const { register, handleSubmit, reset } = useForm<SigninInput>();

  const onSubmit = async (data: SigninInput) => {
    const auth = getAuth();
    try {
      const credentials = await signInWithEmailAndPassword(auth, data.email, data.password);
      reset();
      if (credentials.user.emailVerified) {
        toast("サインインしました");
      } else {
        toast.error("メールアドレスが認証されていません");
        await signOut(auth);
        throw new Error("EMAIL NOT VERIFIED");
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error("サインインできませんでした");
        return;
      }
    }
  };

  if (user && !isLoading) {
    redirect("/");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input type="email" id="email" {...register("email")} />
      </div>
      <div>
        <label htmlFor="password">パスワード</label>
        <input type="password" id="password" {...register("password")} />
      </div>
      <button type="submit">ログイン</button>
    </form>
  );
};
