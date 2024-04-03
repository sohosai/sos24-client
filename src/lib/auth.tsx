"use client";

import { FC, PropsWithChildren, useEffect, useState } from "react";
import { SWRConfig, useSWRConfig } from "swr";
import { useAuthState } from "./firebase";
import { fetcherWithToken } from "@/lib/swr";
import { Auth } from "@/components/auth/Auth";

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
        errorRetryCount: 2
      }}>
      <Auth>
        {children}
      </Auth>
    </SWRConfig>
  );
};
