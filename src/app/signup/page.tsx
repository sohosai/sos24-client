"use client";

import { NextPage } from "next";
import { SignupForm } from "./SignupForm";
import NextLink from "next/link";
import { useAuthState } from "@/lib/firebase";
import { redirect } from "next/navigation";
import { css } from "@styled-system/css";
import Image from "next/image";
import Triangle from "@/app/signin/Triangle.svg";

const SignupPage: NextPage = () => {
  const { user, isLoading } = useAuthState();

  if (!isLoading && user) {
    redirect("/dashboard");
  }

  return (
    <div className={css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDir: "column",
      width: "100%",
      height: "calc(100vh - token(spacing.20))"
    })}>
      <h1 className={css({
        fontSize: "2xl",
        fontWeight: "bold"
      })}>新規登録</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SignupForm />
          <div className={css({ marginTop: 4, display: "flex", gap: 3.5 })}>
            <Image src={Triangle} alt={"三角形のアイコン"} />
            <NextLink href="/signup"
                      className={css({
                        textDecoration: "underline",
                        fontWeight: "bold"
                      })}>新規アカウント登録はこちら</NextLink>
          </div>
        </>
      )}
    </div>
  );
};

export default SignupPage;
