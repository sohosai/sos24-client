"use client";

import { FC, PropsWithChildren, useEffect, useState } from "react";
import { SWRConfig, useSWRConfig } from "swr";
import { useAuthState } from "./firebase";
import { fetcherWithToken } from "@/lib/swr";
import { AuthUI } from "@/components/auth/AuthUI";
import { Header } from "@/components/Header";

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const authState = useAuthState();

  const { mutate } = useSWRConfig();
  useEffect(() => {
    mutate(() => true);
  }, [authState, mutate]);

  return (
    <SWRConfig
      value={{
        fetcher: async (url) => fetcherWithToken(url, authState.user?.idToken),
        errorRetryCount: 2,
      }}>
      <AuthUI>{children}</AuthUI>
    </SWRConfig>
  );
};
