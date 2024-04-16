"use client";
import { css } from "@styled-system/css";
import { FC } from "react";
import Link from "next/link";
import { MenuData } from "./Header";
import { hstack } from "@styled-system/patterns";

export const HeaderNavigation: FC<{ menu: MenuData[] }> = ({ menu }) => {
  const commonItemStyle = css({
    display: "block",
    height: "100%",
    lineHeight: "100%",
  });
  return (
    <ul
      className={hstack({
        "& > *": {
          flexGrow: 1,
        },
        textAlign: "center",
        lg: { display: "none" },
      })}>
      {menu.map((menu) => (
        <li key={menu.path}>
          <Link href={menu.path} className={commonItemStyle}>
            {menu.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
