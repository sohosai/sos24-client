"use client";

import { NextPage } from "next";
import { css } from "@styled-system/css";
import Image from "next/image";
import Triangle from "@/assets/Triangle.svg?url";
import { authModeAtom } from "@/common_components/auth/AuthUI";
import { useSetAtom } from "jotai";
import { center } from "@styled-system/patterns";
import { Dispatch, SetStateAction } from "react";
import { SignUpForm } from "./SignupForm";

interface SignupPageProps {
  setUserEmail: Dispatch<SetStateAction<string | null>>;
}

const SignupPage: NextPage<SignupPageProps> = ({ setUserEmail }) => {
  const setAuthMode = useSetAtom(authModeAtom);

  return (
    <div
      className={center({
        flexDir: "column",
        minHeight: "calc(100vh - token(spacing.20))",
      })}>
      <h1
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
        })}>
        新規登録
      </h1>
      <SignUpForm setUserEmail={setUserEmail} />
      <div className={css({ marginTop: 4, display: "flex", gap: 3.5 })}>
        <Image src={Triangle} alt="" />
        <button
          onClick={() => setAuthMode("signIn")}
          className={css({
            textDecoration: "underline",
            fontWeight: "bold",
            cursor: "pointer",
          })}>
          アカウントを既にお持ちの場合はサインイン
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
