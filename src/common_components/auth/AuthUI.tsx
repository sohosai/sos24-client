"use client";
import React, { FC, PropsWithChildren } from "react";
import { Header } from "@/common_components/header/Header";
import SigninPage from "@/common_components/auth/signin/page";
import SignupPage from "@/common_components/auth/signup/page";
import { useAtomValue } from "jotai";
import { useAuthState } from "@/lib/firebase";
import { Loading } from "@/common_components/Loading";
import { css } from "@styled-system/css";
import { EmailVerification } from "@/common_components/auth/EmailVerification";
import { usePathname } from "next/navigation";
import { atomWithHash } from "jotai-location";
import { ResetPassword } from "./resetPassword/ResetPassword";

export const authModeAtom = atomWithHash<"signIn" | "signUp" | "resetPassword">("authMode", "signIn");

export const AuthUI: FC<PropsWithChildren> = ({ children }) => {
  const authMode = useAtomValue(authModeAtom);
  const authState = useAuthState();

  const path = usePathname();
  if (path === "/") {
    return (
      <>
        <Header />
        {children}
      </>
    );
  } else if (path === "/how-to-use") {
    return children;
  }

  const Component: React.FC = () => {
    switch (authMode) {
      case "signIn":
        return <SigninPage />;

      case "signUp":
        return <SignupPage />;

      case "resetPassword":
        return <ResetPassword />;

      default:
        return <></>;
    }
  };

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
        <Component />
      )}
    </>
  );
};
