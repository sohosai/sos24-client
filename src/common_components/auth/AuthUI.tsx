"use client";
import React, { FC, PropsWithChildren, useCallback, useState } from "react";
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
import { assignType } from "@/lib/openapi";
import useSWR from "swr";

export const authModeAtom = atomWithHash<"signIn" | "signUp" | "resetPassword">("authMode", "signIn");

export const AuthUI: FC<PropsWithChildren> = ({ children }) => {
  const authMode = useAtomValue(authModeAtom);
  const authState = useAuthState();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const { data: userRes, isLoading: userIsLoading } = useSWR("/users/me");
  const userInfo = !userIsLoading ? assignType("/users/me", userRes) : undefined;
  const path = usePathname();

  const Component = useCallback(() => {
    switch (authMode) {
      case "signIn":
        return <SigninPage />;

      case "signUp":
        return <SignupPage setUserEmail={setUserEmail} />;

      case "resetPassword":
        return <ResetPassword />;

      default:
        return <></>;
    }
  }, [authMode]);

  if (path === "/") {
    return (
      <>
        <Header userIsLoading={userIsLoading} userInfo={userInfo} />
        {children}
      </>
    );
  } else if (path === "/how-to-use") {
    return children;
  }

  return (
    <>
      <Header userIsLoading={userIsLoading} userInfo={userInfo} />
      {authState.isLoading ? (
        <div
          className={css({
            height: "calc(100vh - token(spacing.20))",
          })}>
          <Loading />
        </div>
      ) : authState.user ? (
        <>{authState.user.emailVerified ? <>{children}</> : <EmailVerification userEmail={userEmail} />}</>
      ) : (
        <Component />
      )}
    </>
  );
};
