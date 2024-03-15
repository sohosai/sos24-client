"use client"

import { useAuthState } from "@/lib/firebase";
import { css } from "@styled-system/css";
import { getAuth, signOut } from "firebase/auth";
import { FC } from "react";
import toast from "react-hot-toast";

export const Header: FC = () => {
    const { user, isLoading } = useAuthState()
    const auth = getAuth()

    const handleSignOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            toast.error("サインアウトできませんでした")
        }

        toast.success("サインアウトしました")
    }

    return (
        <header className={css({
            display: "flex",
            justifyContent: "space-between",
            padding: 5,
        })}>
            <h1>雙峰祭オンラインシステム</h1>
            {isLoading ? (
                <></>
            ) : (<nav className={css({
                display: "flex",
                alignItems: "center",
                gap: 5,
            })}>
                {user ?
                    (<>
                        <button
                            onClick={handleSignOut}
                            className={css({
                                cursor: "pointer",
                                color: "gray.500",
                                fontSize: "sm",
                            })}
                        >サインアウト</button>
                        <button
                            className={css({
                                cursor: "pointer",
                                fontSize: "sm",
                                background: "orange.400",
                                rounded: "md",
                                px: 2,
                                py: 1,
                            })}
                        >実委人切り替え</button>
                    </>)
                    :
                    (<a href="/signin">サインイン</a>)
                }
            </nav >)}
        </header >
    )
}