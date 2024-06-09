"use client";
import { css } from "@styled-system/css";
import { FC } from "react";
import Link from "next/link";
import { MenuData } from "./Header";
import { hstack } from "@styled-system/patterns";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import style_HeaderNavigation from "@/common_components/header/HeaderNavigation.module.scss";
import { useAuthState } from "@/lib/firebase";

export const HeaderNavigation: FC<{ menu: MenuData[]; path: any; handleSignOut: any; router: any }> = ({
  menu,
  path,
  handleSignOut,
  router,
}) => {
  const { data: userRes, isLoading: userIsLoading } = useSWR("/users/me");
  const userInfo = !userIsLoading ? assignType("/users/me", userRes) : undefined;
  const { user, isLoading } = useAuthState();

  const commonItemStyle = css({
    display: "block",
    height: "100%",
    lineHeight: "100%",
  });
  return (
    <ul
      className={`${style_HeaderNavigation.headerNav} ${hstack({
        "& > *": {
          flexGrow: 1,
        },
        textAlign: "center",
        marginTop: {
          base: "5px",
          lg: "0",
        },
        marginX: {
          base: "10px",
          lg: "0",
        },
        overflowX: "auto",
        lg: { display: "none" },
      })}`}>
      {(userInfo?.owned_project_id || path.startsWith("/committee")) &&
        menu.map((menu) => (
          <li key={menu.path}>
            <Link href={menu.path} className={commonItemStyle}>
              {menu.name}
            </Link>
          </li>
        ))}
      {isLoading ? (
        <></>
      ) : user ? (
        <li>
          <button
            onClick={handleSignOut}
            className={`${style_HeaderNavigation.signoutBtn} ${css({
              cursor: "pointer",
              fontSize: "sm",
              px: 5,
              height: "100%",
            })}`}>
            ログアウト
          </button>
        </li>
      ) : (
        <li>
          <button
            onClick={() => router.push("/register")}
            className={`${style_HeaderNavigation.signinBtn} ${css({
              cursor: "pointer",
              fontSize: "sm",
              px: 5,
              height: "100%",
            })}`}>
            ログイン / 新規登録
          </button>
        </li>
      )}
    </ul>
  );
};
