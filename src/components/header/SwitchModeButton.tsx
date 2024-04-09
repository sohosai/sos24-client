import ModeSwitch from "@/components/assets/SwitchMode.svg";
import ModeSwitchWhite from "@/components/assets/SwitchModeWhite.svg";

import { css } from "@styled-system/css";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const SwitchModeButton: FC<{ isCommitteeMode: boolean; showMobileMenu: boolean }> = ({
  isCommitteeMode,
  showMobileMenu,
}) => (
  <Link href={isCommitteeMode ? "/" : "/committee"}>
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
