"use client";
import { css } from "@styled-system/css";
import { FC } from "react";
import Link from "next/link";
import { MenuData } from "./Header";

export const HeaderNavigation: FC<{ menu: MenuData[] }> = ({ menu }) => {
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
