"use client";
import { css } from "@styled-system/css";
import { FC } from "react";
import Link from "next/link";
import { MenuData } from "./Header";
import { hstack } from "@styled-system/patterns";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";

export const HeaderNavigation: FC<{ menu: MenuData[]; path: any }> = ({ menu, path }) => {
  const { data: userRes, isLoading: userIsLoading } = useSWR("/users/me");
  const userInfo = !userIsLoading ? assignType("/users/me", userRes) : undefined;

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
        marginTop: {
          base: "5px",
          lg: "0",
        },
        lg: { display: "none" },
      })}>
      {(userInfo?.owned_project_id || path.startsWith("/committee")) &&
        menu.map((menu) => (
          <li key={menu.path}>
            <Link href={menu.path} className={commonItemStyle}>
              {menu.name}
              {/* (HeaderNavigation) */}
            </Link>
          </li>
        ))}
    </ul>
  );
};
