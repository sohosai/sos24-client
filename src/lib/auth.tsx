"use client";

import { FC, PropsWithChildren, useEffect, useState } from "react";
import { SWRConfig, useSWRConfig } from "swr";
import { useAtom } from "jotai";
import { authStateAtom, useAuthState } from "./firebase";
import { Provider } from "jotai/react";
import { fetcherWithToken } from "@/lib/swr";

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const authState = useAuthState();

  const { mutate } = useSWRConfig();
  useEffect(() => {
    console.log("authState changed", authState.user?.idToken);
    mutate(() => true);
  }, [authState]);

  return (
    <SWRConfig
      value={{
        fetcher: async (url) => fetcherWithToken(url, authState.user?.idToken),
        errorRetryCount: 2
      }}>
      {children}
    </SWRConfig>
  );
};
