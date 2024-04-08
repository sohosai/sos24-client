"use client";
import { css } from "@styled-system/css";
import { FC } from "react";
import Link from "next/link";
import { MenuData } from "./Header";

const HeaderMenuItemStyle = css({ height: "100%", alignItems: "center", display: "flex" });
const HeaderMenuItemLinkStyle = css({ display: "block", paddingX: 5, lineHeight: 5 });
export const HeaderMenuItems: FC<{ menu: MenuData[] }> = ({ menu }) => {
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
