"use client";

import { useAuthState } from "@/lib/firebase";
import { css } from "@styled-system/css";
import { getAuth, signOut } from "firebase/auth";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import logo from "@/assets/Logo.svg?url";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { hstack } from "@styled-system/patterns";
import { Route } from "next";
import { HeaderButton } from "./HeaderButton";
import { HeaderMenuItems } from "./HeaderMenuItems";
import { HeaderNavigationMobile } from "./HeaderNavigationMobile";
import { components } from "@/schema";
import { useAtom } from "jotai";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";
import { getYearDisplayString } from "@/lib/yearUtils";

import icon_ModeSwitch from "@/assets/SwitchMode.svg?url";
import icon_Signout from "@/assets/Signout.svg?url";

export type MenuData = {
  path: Route;
  name: string;
};

const generalMenu: MenuData[] = [
  {
    path: "/dashboard",
    name: "企画情報",
  },
  {
    path: "/forms",
    name: "申請",
  },
  {
    path: "/news",
    name: "お知らせ",
  },
];

const committeeMenu: MenuData[] = [
  {
    path: "/committee/projects",
    name: "企画",
  },
  {
    path: "/committee/forms",
    name: "申請",
  },
  {
    path: "/committee/news",
    name: "お知らせ",
  },
];

const committeeOperatorMenu: MenuData[] = [
  {
    path: "/committee/projects",
    name: "企画",
  },
  {
    path: "/committee/forms",
    name: "申請",
  },
  {
    path: "/committee/news",
    name: "お知らせ",
  },
  {
    path: "/committee/users",
    name: "ユーザー",
  },
];

const menuForRole = (role?: components["schemas"]["UserRole"]): MenuData[] => {
  switch (role) {
    case "administrator":
    case "committee_operator":
    case "committee_editor":
      return committeeOperatorMenu;
    case "committee_viewer":
    case "committee_drafter":
      return committeeMenu;
    case "general":
      return generalMenu;
    default:
      return [];
  }
};

type Props = {
  userIsLoading: boolean;
  userInfo?: components["schemas"]["User"];
};

export const Header: FC<Props> = ({ userInfo, userIsLoading }) => {
  const router = useRouter();
  const { user, isLoading } = useAuthState();
  const auth = getAuth();

  const path = usePathname();

  const [applicationPeriod] = useAtom(projectApplicationPeriodAtom);

  const menuItemPathName =
    path.indexOf("/", 11) === -1
      ? path !== "/committee"
        ? path
        : "/committee/projects"
      : path.substring(0, path.indexOf("/", 11));
  const [menuPathName, setMenuPathName] = useState(menuItemPathName);

  const menu = isLoading
    ? []
    : user
      ? path.startsWith("/committee")
        ? menuForRole(userInfo?.role)
        : applicationPeriod.isIn
          ? [
              {
                path: "/register",
                name: "企画応募",
              } as MenuData,
            ]
          : generalMenu
      : [];

  const handleSignOut = async () => {
    toast.promise(
      (async (): Promise<void> => {
        await signOut(auth);
      })(),
      {
        loading: "サインアウトしています",
        success: "サインアウトしました",
        error: "サインアウトできませんでした",
      },
    );
  };
  return (
    <header
      className={css({
        borderBottom: "solid 1px",
        borderColor: "gray.200",
        position: "sticky",
        top: 0,
        left: 0,
        fontWeight: "bold",
        background: "white",
        display: "grid",
        paddingY: 4,
        gridTemplateRows: "1fr, 1fr",
        zIndex: 2,
        lg: {
          height: 20,
          paddingY: 0,
          display: "block",
        },
      })}>
      <div
        className={css({
          zIndex: 100,
          display: { lg: "flex", base: "grid" },
          gridTemplateColumns: "1fr 5fr 1fr",
          justifyContent: { base: "space-around", lg: "space-between" },
          alignItems: "center",
          paddingX: 2,
          lg: {
            height: "100%",
          },
        })}>
        <nav
          className={css({
            display: {
              base: "flex",
              lg: "none",
            },
            alignItems: "stretch",
            height: "100%",
            justifyContent: "center",
          })}>
          {!userIsLoading && user && (
            <HeaderButton clickev={handleSignOut} icon={icon_Signout}>
              サインアウト
            </HeaderButton>
          )}
        </nav>
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { lg: 5, base: 2 },
            lg: {
              paddingLeft: 5,
              height: "100%",
            },
          })}>
          <Link className={hstack()} href="/">
            <Image src={logo} alt="" className={css({ width: { lg: 10, base: 8 } })} />
            <div className={css({ display: "flex", flexDirection: "column", alignItems: "flex-start" })}>
              <h1
                className={css({
                  color: "black",
                  fontSize: { base: "lg", lg: "2xl" },
                  lineHeight: "1.2",
                })}>
                雙峰祭オンラインシステム
              </h1>
              <div
                className={css({
                  color: "gray.600",
                  fontSize: { base: "xs", lg: "sm" },
                  fontWeight: "normal",
                  marginTop: { base: "1px", lg: "2px" },
                })}>
                {getYearDisplayString()}
              </div>
            </div>
          </Link>
          <a
            href="https://www.sakura.ad.jp/"
            target="_blank"
            rel="noreferrer"
            className={css({
              position: "relative",
              _before: {
                content: '"supported by"',
                position: "absolute",
                top: "-50%",
                left: "-10%",
                whiteSpace: "nowrap",
              },
              display: {
                base: "none",
                lg: "block",
              },
              fontSize: "xs",
              color: "gray.500",
              marginLeft: "10px",
            })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://r2-2024.sohosai.com/sakura-logo.svg"
              alt="SAKURA internet"
              className={css({ height: 9, position: "relative", top: 1 })}
            />
          </a>
          {/* PCユーザーメニュー */}
          {(userInfo?.owned_project_id || path.startsWith("/committee")) && (
            <HeaderMenuItems menu={menu} path={menuPathName} setPathName={setMenuPathName} />
          )}
        </div>
        {isLoading ? (
          <></>
        ) : user ? (
          <nav
            className={css({
              display: "flex",
              alignItems: "stretch",
              height: "100%",
              justifyContent: "center",
            })}>
            <button
              onClick={handleSignOut}
              className={css({
                cursor: "pointer",
                fontSize: "sm",
                px: 5,
                height: "100%",
                borderX: "solid 1px token(colors.gray.200)",
                display: { base: "none", lg: "block" },
              })}>
              サインアウト
            </button>
            {!userIsLoading &&
              [
                "committee_viewer",
                "committee_drafter",
                "committee_editor",
                "committee_operator",
                "administrator",
              ].includes(userInfo?.role ?? "") && (
                <HeaderButton
                  icon={icon_ModeSwitch}
                  clickev={() => {
                    router.push(path.startsWith("/committee") ? "/dashboard" : "/committee");
                    localStorage.removeItem("invitation_id");
                    setMenuPathName(path.startsWith("/committee") ? "/dashboard" : "/committee/projects");
                  }}>
                  <span className={css({ display: { base: "none", lg: "inline" } })}>
                    {path.startsWith("/committee") ? "一般" : "実委人"}
                  </span>
                  切り替え
                </HeaderButton>
              )}
          </nav>
        ) : (
          <nav
            className={css({
              display: "flex",
              alignItems: "stretch",
              height: "100%",
              justifyContent: "center",
            })}>
            <button
              onClick={() => router.push("/register")}
              className={css({
                cursor: "pointer",
                fontSize: "sm",
                px: 5,
                height: "100%",
                borderX: "solid 1px token(colors.gray.200)",
                display: { base: "none", lg: "block" },
              })}>
              サインイン/新規登録
            </button>
          </nav>
        )}
      </div>
      {userInfo && <HeaderNavigationMobile menu={menu} path={path} userInfo={userInfo} />}
    </header>
  );
};
