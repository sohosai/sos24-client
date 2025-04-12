"use client";
import { css } from "@styled-system/css";
import { Dispatch, FC } from "react";
import Link from "next/link";
import { MenuData } from "./Header";
import { SetStateAction } from "jotai";

const HeaderMenuItemStyle = css({ height: "100%", alignItems: "center", display: "flex" });
const HeaderMenuTargetItemLinkStyle = css({
  display: "block",
  paddingX: 5,
  lineHeight: 5,
  whiteSpace: "nowrap",
  color: "tsukuba.purple",
  borderBottom: "2px solid ",
});
const HeaderMenuItemLinkStyle = css({
  display: "block",
  paddingX: 5,
  lineHeight: 5,
  whiteSpace: "nowrap",
});
export const HeaderMenuItems: FC<{
  menu: MenuData[];
  path: string;
  setPathName: Dispatch<SetStateAction<string>>;
}> = ({ menu, path, setPathName }) => {
  return (
    <ul className={css({ lg: { display: "flex", paddingX: 5, height: "100%" }, display: "none" })}>
      {menu.map((e) => (
        <li className={HeaderMenuItemStyle} key={e.path}>
          <Link
            href={e.path}
            className={e.path === path ? HeaderMenuTargetItemLinkStyle : HeaderMenuItemLinkStyle}
            onClick={() => (e.path !== "/register" ? setPathName(e.path) : undefined)}>
            {e.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
