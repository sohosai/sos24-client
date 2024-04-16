import ModeSwitch from "@/assets/SwitchMode.svg?url";
import ModeSwitchWhite from "@/assets/SwitchModeWhite.svg?url";

import { css } from "@styled-system/css";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const SwitchModeButton: FC<{ isCommitteeMode: boolean; showMobileMenu: boolean }> = ({
  isCommitteeMode,
  showMobileMenu,
}) => (
  <Link href={isCommitteeMode ? "/dashboard" : "/committee"}>
    <button
      className={css({
        cursor: "pointer",
        fontSize: "sm",
        px: { lg: 5, base: 0 },
        height: "100%",
        display: "flex",
        flexDir: { base: "column", lg: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: { lg: 2, base: 0 },
        textDecoration: "underline",
        color: showMobileMenu ? "white" : "black",
      })}
      onClick={() => {
        localStorage.removeItem("invitation_id");
      }}>
      <Image
        src={showMobileMenu ? ModeSwitchWhite : ModeSwitch}
        alt=""
        className={css({
          filter: "drop-shadow(0 0 5px rgb(0 0 0 / 0.1))",
          height: { base: 6, lg: 10 },
          color: showMobileMenu ? "white" : "black",
        })}
      />
      <span>
        <span className={css({ display: { base: "none", lg: "inline" } })}>{isCommitteeMode ? "一般" : "実委人"}</span>
        切り替え
      </span>
    </button>
  </Link>
);
