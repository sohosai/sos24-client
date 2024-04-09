"use client";
import { css } from "@styled-system/css";
import { FC } from "react";
import Link from "next/link";
import { visuallyHidden } from "@styled-system/patterns";
import { MenuData } from "./Header";

const MobileMenuItemStyle = css({
  borderBottom: "solid 2px",
  lineHeight: "200%",
  paddingX: "15px",
});
export const MobileMenu: FC<{
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
        <li className={MobileMenuItemStyle} key={e.path}>
          <Link href={e.path}>{e.name}</Link>
        </li>
      ))}
    </ul>
    {isCommittee && (
      <Link className={MobileMenuItemStyle} href={`${isCommitteeMode ? "/" : "/committee"}`}>
        {isCommitteeMode ? "一般" : "実委人"}ページへ
      </Link>
    )}
    <button className={css({ border: "2px solid", paddingX: 10, paddingY: 2 })} onClick={signOutFunc}>
      ログアウト
    </button>
  </nav>
);
