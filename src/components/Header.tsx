"use client";

import { useAuthState } from "@/lib/firebase";
import { css } from "@styled-system/css";
import { getAuth, signOut } from "firebase/auth";
import { FC, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import logo from "./assets/Logo.svg";
import ModeSwitch from "./assets/SwitchMode.svg";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

export const Header: FC = () => {
  const { user, isLoading } = useAuthState();
  const auth = getAuth();
  const { data: userRes } = useSWR("/users/me");
  const userInfo = userRes ? assignType("/users/me", userRes.json) : undefined;
  const path = usePathname();

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
          height: 20, fontWeight: "bold"
        })}>
        <div className={css({ display: "flex", alignItems: "center", gap: 5, fontSize: "2xl" })}>
          <Image src={logo} alt="雙峰祭ロゴマーク" className={css({ width: 10 })} />
          <h1>雙峰祭オンラインシステム</h1>
          <a href="https://www.sakura.ad.jp/" target="_blank" rel="noreferrer" className={css({
            position: "relative",
            _before: {
              content: "\"supported by\"",
              position: "absolute",
              top: "-100%",
              left: "-10%"
            },
            fontSize: "xs",
            color: "gray.500",
            marginLeft: "10px"
          })}><img
            src="https://www.sakura.ad.jp/brand-assets/images/logo-3.png" className={css({ height: 6 })} /></a>
        </div>
        {isLoading ? (
          <></>
        ) : (
          <nav
            className={css({
              display: "flex",
              alignItems: "stretch",
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
                {userInfo?.role !== "general" && (
                  <Link href={path.startsWith("/committee") ? "/dashboard" : "/committee/dashboard"}>
                    <button
                      className={css({
                        cursor: "pointer",
                        fontSize: "sm",
                        px: 5,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        textDecoration: "underline"
                      })}>
                      <Image src={ModeSwitch} alt="人のアイコンの周囲に矢印"
                             className={css({ filter: "drop-shadow(0 0 5px rgb(0 0 0 / 0.1))" })} />
                      {path.startsWith("/committee") ? "一般" : "実委人"}
                      切り替え
                    </button>
                  </Link>
                )}

              </>
            ) : <></>}
          </nav>
        )}
      </header>
    </>
  );
};
