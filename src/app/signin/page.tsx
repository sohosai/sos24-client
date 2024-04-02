"use client";

import { NextPage } from "next";
import { SigninForm } from "./SignInPage";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { useAuthState } from "@/lib/firebase";
import { css } from "@styled-system/css";
import Image from "next/image";
import Triangle from "./Triangle.svg";

const SigninPage: NextPage = () => {
  const { user, isLoading } = useAuthState();

  if (!isLoading && user) {
    redirect("/dashboard");
  }
  return (
    <div className={css({
      display: "flex", justifyContent: "center", alignItems: "center", width: "100%",
      height: "calc(100vh - token(spacing.20))"
    })}>
      <div className={css({
        display: "flex",
        flexDir: "column",
        alignItems: "center",
        boxShadow: "token(shadows.lg)",
        paddingY: 11,
        paddingX: 20,
        borderRadius: "token(xl)",
        width: "fit-content"
      })}>
        <h1 className={css({ fontSize: "2xl", fontWeight: "bold", marginBottom: 8 })}>ログイン</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <SigninForm />
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
    </div>
  );
};

export default SigninPage;
