"use client";
import { css } from "@styled-system/css";
import { FC } from "react";
import Link from "next/link";
import { MenuData } from "./Header";
import { hstack } from "@styled-system/patterns";
import { components } from "@/schema";

export type Props = {
  menu: MenuData[];
  path: any;
  userInfo: components["schemas"]["User"];
};

export const HeaderNavigationMobile: FC<Props> = ({ menu, path, userInfo }) => {
  const commonItemStyle = css({
    display: "block",
    height: "100%",
    lineHeight: "100%",
  });
  return (
    <ul
      className={`${css({
        "& > li": {
          whiteSpace: "nowrap",
          "&:not(.signoutBtn):not(.signinBtn)": {
            transition: "all 0.1s",
          },
        },
      })} ${hstack({
        "& > *": {
          flexGrow: 1,
        },
        textAlign: "center",
        marginTop: {
          base: 5,
          lg: "0",
        },
        marginX: {
          base: 2.5,
          lg: "0",
        },
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
    </ul>
  );
};
