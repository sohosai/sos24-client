import Image from "next/image";

import SuyasuyaBellIcon from "./assets/SuyasuyaBell.png";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";
export const NoResultNotice = (props: { message: string }) => {
  return (
    <div
      className={flex({
        pt: 6,
        pb: 16,
        alignItems: "center",
        gap: 4,
        direction: "column",
      })}>
      <div className={css({ pl: 0, pr: 0 })}>
        <Image
          src={SuyasuyaBellIcon}
          alt=""
          className={css({
            height: 24,
            width: 24,
          })}
        />
      </div>
      <span
        className={css({
          verticalAlign: "middle",
          color: "#A59E9E",
          fontSize: 18,
          fontWeight: 700,
        })}>
        {props.message}
      </span>
    </div>
  );
};
