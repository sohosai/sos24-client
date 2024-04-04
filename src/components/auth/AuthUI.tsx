import React, { FC, PropsWithChildren } from "react";
import { Header } from "@/components/Header";
import SigninPage from "@/components/auth/signin/page";
import SignupPage from "@/components/auth/signup/page";
import { atom, useAtomValue } from "jotai";
import { useAuthState } from "@/lib/firebase";
import { Loading } from "@/components/Loading";
import { css } from "@styled-system/css";

export const authModeAtom = atom<"signIn" | "signUp">("signIn");

export const AuthUI: FC<PropsWithChildren> = ({ children }) => {
  const authMode = useAtomValue(authModeAtom);
  const authState = useAuthState();
  return (
    <>
      <Header />
      {authState.isLoading
        ? (
          <div
            className={css({
              height: "calc(100vh - token(spacing.20))",
            })}
          >
            <Loading />
          </div>
        )
        : authState.user
        ? children
        : <>{authMode === "signIn" ? <SigninPage /> : <SignupPage />}</>}
    </>
  );
};
