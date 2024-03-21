"use client";

import { NextPage } from "next";
import { SignupForm } from "./SignupForm";
import NextLink from "next/link";
import { useAuthState } from "@/lib/firebase";
import { redirect } from "next/navigation";

const SignupPage: NextPage = () => {
  const { user, isLoading } = useAuthState();

  if (!isLoading && user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>新規登録</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SignupForm />
          <p>
            すでにアカウントをお持ちの場合は <NextLink href="/signin">サインイン</NextLink> してください
          </p>
        </>
      )}
    </div>
  );
};

export default SignupPage;
