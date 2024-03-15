"use client"

import { FC, PropsWithChildren, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { SWRConfig } from "swr";
import { useAtom } from "jotai";
import { authStateAtom } from "./firebase";

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
    const [authState, setAuthState] = useAtom(authStateAtom)

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setAuthState({
                user: user ? {
                    id: user.uid,
                    idToken: await user.getIdToken()
                } : null,
                isLoading: false,
            })
        });
        return unsubscribe;
    }, [setAuthState]);

    return (
        <div>
            <SWRConfig value={{
                fetcher: async (resource) => {
                    const headers = authState.user ? { Authorization: `Bearer ${authState?.user.idToken}` } : undefined;
                    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${resource}`, { headers }).then(res => res.json());

                    return resp
                }
            }
            }>
                {children}
            </SWRConfig >
        </div>
    )
}