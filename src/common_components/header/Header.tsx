"use client";

import { useAuthState } from "@/lib/firebase";
import { css } from "@styled-system/css";
import { getAuth, signOut } from "firebase/auth";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import logo from "@/assets/Logo.svg?url";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuButton from "@/assets/MenuButton.svg?url";
import CloseButton from "@/assets/CloseButton.svg?url";
import { hstack } from "@styled-system/patterns";
import { Route } from "next";
import { SwitchModeButton } from "./SwitchModeButton";
import { MobileMenu } from "./MobileMenu";
import { HeaderMenuItems } from "./HeaderMenuItems";
import { HeaderNavigation } from "./HeaderNavigation";
import { components } from "@/schema";
import { useAtom } from "jotai";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";

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
      return committeeOperatorMenu;
    case "committee":
      return committeeMenu;
    case "general":
      return generalMenu;
    default:
      return [];
  }
};

export const Header: FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuthState();
  const auth = getAuth();
  const { data: userRes, isLoading: userIsLoading } = useSWR("/users/me");
  const userInfo = !userIsLoading ? assignType("/users/me", userRes) : undefined;

  const path = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [path]);

  const [applicationPeriod] = useAtom(projectApplicationPeriodAtom);

  const menu = user
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
    : [
        {
          path: "/register",
          name: "サインイン/新規登録",
        } as MenuData,
      ];

  const handleSignOut = async () => {
    toast.promise(
      (async (): Promise<void> => {
        await signOut(auth);
        setShowMobileMenu(false);
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
        gap: 4,
        paddingY: 4,
        gridTemplateRows: "1fr, 1fr",
        zIndex: 2,
        lg: {
          height: 20,
          paddingY: 0,
          display: "block",
        },
      })}>
      {userInfo?.owned_project_id && showMobileMenu && (
        <MobileMenu
          menu={menu}
          isCommittee={["committee", "committee_operator", "administrator"].includes(userInfo?.role ?? "")}
          show={showMobileMenu}
          signOutFunc={handleSignOut}
          isCommitteeMode={path.startsWith("/committee")}
        />
      )}
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
        {userInfo?.owned_project_id ? (
          <button
            className={css({
              display: "flex",
              justifyContent: "center",
              lg: { display: "none" },
            })}
            onClick={() => setShowMobileMenu((e) => !e)}>
            {showMobileMenu ? <Image src={CloseButton} alt="" /> : <Image src={MenuButton} alt="" />}
          </button>
        ) : (
          <div className={css({ lg: { display: "none" } })} />
        )}

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
            <h1
              className={css({
                color: showMobileMenu ? "white" : "black",
                fontSize: { base: "lg", lg: "2xl" },
              })}>
              雙峰祭オンラインシステム
            </h1>
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
          {(userInfo?.owned_project_id || path.startsWith("/committee")) && <HeaderMenuItems menu={menu} />}
        </div>
        {isLoading || !user ? (
          <></>
        ) : (
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
            {!userIsLoading && ["committee", "committee_operator", "administrator"].includes(userInfo?.role ?? "") && (
              <SwitchModeButton isCommitteeMode={path.startsWith("/committee")} showMobileMenu={showMobileMenu} />
            )}
          </nav>
        )}
        {!user && (
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
      <HeaderNavigation menu={menu} />
    </header>
  );
};
