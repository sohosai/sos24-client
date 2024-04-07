"use client";

import { FC, PropsWithChildren, useEffect } from "react";
import { SWRConfig, useSWRConfig } from "swr";
import { useAuthState } from "./firebase";
import { fetcherWithToken } from "@/lib/swr";
import { AuthUI } from "@/_common_components/auth/AuthUI";

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const authState = useAuthState();

  const { mutate } = useSWRConfig();
  useEffect(() => {
    mutate(() => true);
  }, [authState, mutate]);

  return (
    <SWRConfig
      value={{
        fetcher: async (url) =>
          fetcherWithToken(url, await authState.user?.getIdToken()),
        errorRetryCount: 2,
      }}
    >
      <AuthUI>{children}</AuthUI>
    </SWRConfig>
  );
};
