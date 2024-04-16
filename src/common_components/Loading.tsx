import { css } from "@styled-system/css";
import Image from "next/image";
import LoadingSopotan from "@/assets/LoadingSopotan.png";

export const Loading = () => (
  <div
    className={css({ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" })}>
    <div className={css({ textAlign: "center", fontSize: "xl", letterSpacing: "3" })}>
      <Image src={LoadingSopotan} priority={true} loading="eager" alt="" />
      LOADING...
    </div>
  </div>
);
