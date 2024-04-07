import React, { FC, PropsWithChildren } from "react";
import { Header } from "@/_common_components/Header";
import SigninPage from "@/_common_components/auth/signin/page";
import SignupPage from "@/_common_components/auth/signup/page";
import { atom, useAtomValue } from "jotai";
import { useAuthState } from "@/lib/firebase";
import { Loading } from "@/_common_components/Loading";
import { css } from "@styled-system/css";
import { EmailVerification } from "@/_common_components/auth/EmailVerification";

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
