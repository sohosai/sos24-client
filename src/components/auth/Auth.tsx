import React, { useState } from "react";
import { Header } from "@/components/Header";
import SigninPage from "@/components/auth/signin/page";
import SignupPage from "@/components/auth/signup/page";
import { atom, useAtomValue } from "jotai";

export const authModeAtom = atom<"signIn" | "signUp">("signIn");

export default function Auth() {
  const authMode = useAtomValue(authModeAtom);
  return (
    <>
      <Header />
      {authMode === "signIn" ? <SigninPage /> : <SignupPage />}
    </>
  );
}