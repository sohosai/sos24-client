import React, { FC, PropsWithChildren } from "react";
import { Header } from "@/common_components/header/Header";
import SigninPage from "@/common_components/auth/signin/page";
import SignupPage from "@/common_components/auth/signup/page";
import { atom, useAtomValue } from "jotai";
import { useAuthState } from "@/lib/firebase";
import { Loading } from "@/common_components/Loading";
import { css } from "@styled-system/css";
import { EmailVerification } from "@/common_components/auth/EmailVerification";

export const authModeAtom = atom<"signIn" | "signUp">("signIn");

export const AuthUI: FC<PropsWithChildren> = ({ children }) => {
  const authMode = useAtomValue(authModeAtom);
  const authState = useAuthState();
  return (
    <>
      <Header />
      {authState.isLoading ? (
        <div
          className={css({
            height: "calc(100vh - token(spacing.20))",
          })}>
          <Loading />
        </div>
      ) : authState.user ? (
        <>{authState.user.emailVerified ? <>{children}</> : <EmailVerification />}</>
      ) : (
        <>{authMode === "signIn" ? <SigninPage /> : <SignupPage />}</>
      )}
    </>
  );
};
