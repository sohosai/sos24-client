import { FC, PropsWithChildren } from "react";
import { flex } from "@styled-system/patterns";
import Image from "next/image";
import triangleIcon from "@/assets/Triangle.svg?url";
import { css } from "@styled-system/css";

export const Heading: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <h3
        className={flex({
          marginTop: 8,
          gap: 3,
        })}>
        <Image src={triangleIcon} alt="" />
        <span
          className={css({
            fontSize: "md",
            fontWeight: "bold",
          })}>
          {children}
        </span>
      </h3>
    </div>
  );
};
