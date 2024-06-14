"use client";
import { css } from "@styled-system/css";
import Image from "next/image";
import { FC, MouseEventHandler, ReactNode } from "react";

export const HeaderButton: FC<{
  children: ReactNode;
  icon: string;
  clickev: MouseEventHandler<HTMLButtonElement>;
}> = ({ children, icon, clickev }) => (
  <button
    className={css({
      cursor: "pointer",
      fontSize: { base: "sm", lg: "md" },
      px: { lg: 5, base: 0 },
      width: "fit-content",
      height: "full",
      display: "flex",
      flexDir: { base: "column", lg: "row" },
      alignItems: "center",
      justifyContent: "center",
      gap: { lg: 2, base: 0 },
      textDecoration: "underline",
      color: "black",
      transition: "all 0.3s",
      p: "2 2.5 0.5",
      rounded: "sm",
      bg: "transparent",
      outline: "2px solid transparent",
    })}
    onClick={clickev}>
    <Image
      src={icon}
      alt=""
      className={css({
        filter: "drop-shadow(0 0 5px rgb(0 0 0 / 0.1))",
        height: { base: 6, lg: 10 },
        color: "black",
        width: "fit-content",
      })}
    />
    <span
      className={css({
        whiteSpace: "nowrap",
        mt: 1,
      })}>
      {children}
    </span>
  </button>
);
