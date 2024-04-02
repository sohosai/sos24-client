"use client";

import { useAuthState } from "@/lib/firebase";
import { css } from "@styled-system/css";
import { getAuth, signOut } from "firebase/auth";
import { FC, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import logo from "./assets/logo.svg";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";

export const Header: FC = () => {
  const { user, isLoading } = useAuthState();
  const auth = getAuth();
  const { data: userRes, mutate } = useSWR("/users/me");
  const [isCommittee, setIsCommittee] = useState(false);

  useEffect(() => {
    if (userRes) {
      const userInfo = assignType("/users/me", userRes.json);
      console.log(userInfo);
      setIsCommittee(userInfo?.role !== "general");
    } else if (user != null) {
      toast.error("ユーザー情報の取得に失敗しました");
    }
  }, [user, userRes]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      toast.error("サインアウトできませんでした");
    }
    toast.success("サインアウトしました");
  };

  return (
    <>
      <Toaster />
      <header
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 5,
          borderBottom: "solid 1px",
          borderColor: "gray.200",
          height: 20
        })}>
        <div className={css({ display: "flex", alignItems: "center", gap: 5, fontSize: "2xl", fontWeight: "bold" })}>
          <Image src={logo} alt="雙峰祭ロゴマーク" className={css({ width: 10 })} />
          <h1>雙峰祭オンラインシステム</h1>
        </div>
        {isLoading ? (
          <></>
        ) : (
          <nav
            className={css({
              display: "flex",
              alignItems: "center",
              height: "100%"
            })}>
            {user ? (
              <>
                <button
                  onClick={handleSignOut}
                  className={css({
                    cursor: "pointer",
                    fontSize: "sm",
                    px: 5,
                    height: "100%",
                    borderX: "solid 1px token(colors.gray.200)"
                  })}>
                  サインアウト
                </button>
                {(isCommittee) ?? (
                  <button
                    className={css({
                      cursor: "pointer",
                      fontSize: "sm",
                      px: 5,
                      height: "100%"
                    })}>
                    実委人切り替え
                  </button>
                )}

              </>
            ) : <></>}
          </nav>
        )}
      </header>
    </>
  );
};
