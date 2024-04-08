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
import MenuButton from "./assets/MenuButton.svg";
import CloseButton from "./assets/CloseButton.svg";
import ModeSwitchWhite from "./assets/SwitchModeWhite.svg";
import { hstack, visuallyHidden } from "@styled-system/patterns";
import { Route } from "next";

type MenuData = {
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
    // ToDo: merge待ち
    path: "/committee/projects" as Route,
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
    path: "/committee/users" as Route,
    name: "ユーザ",
  },
];

const HeaderNavigation: FC<{ menu: MenuData[] }> = ({ menu }) => {
  const commonItemStyle = css({
    display: "block",
    height: "100%",
    lineHeight: "100%",
  });
  return (
    <ul
      className={css({
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        textAlign: "center",
        sm: { display: "none" },
      })}>
      {menu.map((menu) => (
        <li>
          <Link href={menu.path} className={commonItemStyle}>
            {menu.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const SwitchModeButton: FC<{ isCommitteeMode: boolean; showMobileMenu: boolean }> = ({
  isCommitteeMode,
  showMobileMenu,
}) => (
  <Link href={isCommitteeMode ? "/dashboard" : "/committee/dashboard"}>
    <button
      className={css({
        cursor: "pointer",
        fontSize: "sm",
        px: { sm: 5, base: 0 },
        height: "100%",
        display: "flex",
        flexDir: { base: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: { sm: 2, base: 0 },
        textDecoration: "underline",
        color: showMobileMenu ? "white" : "black",
      })}>
      <Image
        src={showMobileMenu ? ModeSwitchWhite : ModeSwitch}
        alt="人のアイコンの周囲に矢印"
        className={css({
          filter: "drop-shadow(0 0 5px rgb(0 0 0 / 0.1))",
          height: { base: 6, sm: 10 },
          color: showMobileMenu ? "white" : "black",
        })}
      />
      <span>
        <span className={css({ display: { base: "none", sm: "inline" } })}>{isCommitteeMode ? "一般" : "実委人"}</span>
        切り替え
      </span>
    </button>
  </Link>
);

const MobileMenuItemStyle = css({
  borderBottom: "solid 2px",
  lineHeight: "200%",
  paddingX: "15px",
});

const MobileMenu: FC<{
  isCommittee: boolean;
  isCommitteeMode: boolean;
  menu: MenuData[];
  show: boolean;
  signOutFunc: () => void;
}> = ({ isCommittee, menu, isCommitteeMode, show, signOutFunc }) => (
  <nav
    className={
      show
        ? css({
            display: "flex",
            justifyContent: "center",
            flexDir: "column",
            alignItems: "center",
            textAlign: "center",
            position: "fixed",
            color: "white",
            top: 0,
            left: 0,
            background: "neutral.700",
            fontSize: "2xl",
            width: "100vw",
            height: "100vh",
            gap: "12",
            sm: {
              display: "none",
            },
          })
        : visuallyHidden()
    }>
    <ul
      className={css({
        display: "flex",
        flexDir: "column",
        gap: 12,
        paddingY: 20,
      })}>
      {menu.map((e) => (
        <li className={MobileMenuItemStyle}>
          <Link href={e.path}>{e.name}</Link>
        </li>
      ))}
    </ul>
    {isCommittee && (
      <Link className={MobileMenuItemStyle} href={`${isCommitteeMode ? "" : "/committee"}/dashboard`}>
        {isCommitteeMode ? "一般" : "実委人"}ページへ
      </Link>
    )}
    <button className={css({ border: "2px solid", paddingX: 10, paddingY: 2 })} onClick={signOutFunc}>
      ログアウト
    </button>
  </nav>
);

const HeaderMenuItemStyle = css({ height: "100%", alignItems: "center", display: "flex" });
const HeaderMenuItemLinkStyle = css({ display: "block", paddingX: 5, lineHeight: 5 });

const HeaderMenuItems: FC<{ menu: MenuData[] }> = ({ menu }) => {
  return (
    <ul className={css({ sm: { display: "flex", paddingX: 5, height: "100%" }, display: "none" })}>
      {menu.map((e) => (
        <li className={HeaderMenuItemStyle}>
          <Link href={e.path} className={HeaderMenuItemLinkStyle}>
            {e.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const Header: FC = () => {
  const { user, isLoading } = useAuthState();
  const auth = getAuth();
  const { data: userRes, isLoading: userIsLoading } = useSWR("/users/me");
  const userInfo = !userIsLoading ? assignType("/users/me", userRes) : undefined;
  const { error: projectErr, isLoading: projectIsLoading } = useSWR("/projects/me");
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
        sm: {
          height: 20,
          paddingY: 0,
          display: "block",
        },
      })}>
      <Toaster />
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
          display: { sm: "flex", base: "grid" },
          gridTemplateColumns: "1fr 5fr 1fr",
          justifyContent: { base: "space-around", sm: "space-between" },
          alignItems: "center",
          paddingX: 2,
          sm: {
            height: "100%",
          },
        })}>
        {user ? (
          <button
            className={css({
              display: "flex",
              justifyContent: "center",
              sm: { display: "none" },
            })}
            onClick={() => setShowMobileMenu((e) => !e)}>
            {showMobileMenu ? (
              <Image src={CloseButton} alt={"バツボタン"} />
            ) : (
              <Image src={MenuButton} alt="ハンバーガーメニュー" />
            )}
          </button>
        ) : (
          <div className={css({ sm: { display: "none" } })} />
        )}

        <div
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { sm: 5, base: 2 },
            sm: {
              paddingLeft: 5,
              height: "100%",
            },
          })}>
          <Link className={hstack()} href="/">
            <Image src={logo} alt="雙峰祭ロゴマーク" className={css({ width: { sm: 10, base: 8 } })} />
            <h1
              className={css({
                color: showMobileMenu ? "white" : "black",
                fontSize: { base: "lg", sm: "2xl" },
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
                sm: "block",
              },
              fontSize: "xs",
              color: "gray.500",
              marginLeft: "10px",
            })}>
            <img
              src="https://www.sakura.ad.jp/brand-assets/images/logo-3.png"
              alt="さくらインターネットのロゴ"
              className={css({ height: 6 })}
            />
          </a>
          {((!projectIsLoading && !projectErr) || path.startsWith("/committee")) && <HeaderMenuItems menu={menu} />}
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
                display: { base: "none", sm: "block" },
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
