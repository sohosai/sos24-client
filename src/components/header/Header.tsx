"use client";

import { useAuthState } from "@/lib/firebase";
import { css } from "@styled-system/css";
import { getAuth, signOut } from "firebase/auth";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import logo from "@/components/assets/Logo.svg";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuButton from "@/components/assets/MenuButton.svg";
import CloseButton from "@/components/assets/CloseButton.svg";
import { hstack } from "@styled-system/patterns";
import { Route } from "next";
import { SwitchModeButton } from "./SwitchModeButton";
import { MobileMenu } from "./MobileMenu";
import { HeaderMenuItems } from "./HeaderMenuItems";
import { HeaderNavigation } from "./HeaderNavigation";

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
  {
    path: "/committee/users",
    name: "ユーザ",
  },
];

export const Header: FC = () => {
  const { user, isLoading } = useAuthState();
  const auth = getAuth();
  const { data: userRes, isLoading: userIsLoading } = useSWR("/users/me");
  const userInfo = !userIsLoading ? assignType("/users/me", userRes) : undefined;
  const path = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menu = path.startsWith("/committee") ? committeeMenu : generalMenu;

  useEffect(() => {
    setShowMobileMenu(false);
  }, [path]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowMobileMenu(false);
    } catch (error) {
      toast.error("サインアウトできませんでした");
    }
    toast.success("サインアウトしました");
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
      {showMobileMenu && (
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
        {user ? (
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
                top: "-100%",
                left: "-10%",
              },
              display: {
                base: "none",
                lg: "block",
              },
              fontSize: "xs",
              color: "gray.500",
              marginLeft: "10px",
            })}>
            <img src="https://www.sakura.ad.jp/brand-assets/images/logo-3.png" alt="" className={css({ height: 6 })} />
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
      </div>
      {user && <HeaderNavigation menu={menu} />}
    </header>
  );
};
