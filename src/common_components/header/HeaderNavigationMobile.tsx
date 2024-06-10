"use client";
import { css } from "@styled-system/css";
import { FC } from "react";
import Link from "next/link";
import { MenuData } from "./Header";
import { hstack } from "@styled-system/patterns";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";

export const HeaderNavigationMobile: FC<{ menu: MenuData[]; path: any }> = ({ menu, path }) => {
  const { data: userRes, isLoading: userIsLoading } = useSWR("/users/me");
  const userInfo = !userIsLoading ? assignType("/users/me", userRes) : undefined;

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
            _hover: {
              color: "#ed6d1f",
            },
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
