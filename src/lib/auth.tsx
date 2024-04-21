"use client";

import { FC, PropsWithChildren, useEffect } from "react";
import { SWRConfig, useSWRConfig } from "swr";
import { useAuthState } from "./firebase";
import { fetcherWithToken } from "@/lib/swr";
import { AuthUI } from "@/common_components/auth/AuthUI";
import { captureException } from "@sentry/nextjs";

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const authState = useAuthState();

  const { mutate } = useSWRConfig();
  useEffect(() => {
    mutate(() => true);
  }, [authState, mutate]);

  return (
    <SWRConfig
      value={{
        fetcher: async (url) => fetcherWithToken(url, await authState.user?.getIdToken()),
        errorRetryCount: 2,
        onErrorRetry: (error) => {
          if (error.status === 404) return;
          authState.user?.getIdToken(true);
        },
        onError: (err) => {
          if (err.status != 404 && err.status != 403 && err.status != 401) {
            captureException(err);
          }
        },
      }}>
      <AuthUI>{children}</AuthUI>
    </SWRConfig>
  );
};
