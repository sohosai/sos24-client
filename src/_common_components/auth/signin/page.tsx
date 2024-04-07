"use client";

import { NextPage } from "next";
import { SigninForm } from "./SignInPage";
import { css } from "@styled-system/css";
import Image from "next/image";
import Triangle from "@/_common_components/assets/Triangle.svg";
import { authModeAtom } from "@/_common_components/auth/AuthUI";
import { useSetAtom } from "jotai";
import { center } from "@styled-system/patterns";

const SigninPage: NextPage = () => {
  const setAuthMode = useSetAtom(authModeAtom);

  return (
    <div
      className={center({
        minHeight: "calc(100vh - token(spacing.20))",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDir: "column",
          alignItems: "center",
          boxShadow: "token(shadows.md)",
          paddingY: 11,
          paddingX: 20,
          borderRadius: "token(xl)",
          width: "fit-content",
          maxWidth: "90%",
        })}
      >
        <h1
          className={css({
            fontSize: "2xl",
            fontWeight: "bold",
            marginBottom: 8,
          })}
        >
          ログイン
        </h1>
        <SigninForm />
        <div className={css({ marginTop: 4, display: "flex", gap: 3.5 })}>
          <Image src={Triangle} alt={"三角形のアイコン"} />
          <button
            onClick={() => setAuthMode("signUp")}
            className={css({
              textDecoration: "underline",
              fontWeight: "bold",
              cursor: "pointer",
              wordBreak: "auto-phrase",
            })}
          >
            新規アカウント登録
            <wbr />
            はこちら
          </button>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
