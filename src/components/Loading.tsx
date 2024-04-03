import { css } from "@styled-system/css";
import Image from "next/image";
import LoadingSopotan from "./assets/LoadingSopotan.svg";

export const Loading = () => (<div
  className={css({ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" })}>
  <div className={css({textAlign: "center", fontSize: "xl", letterSpacing: "3"})}>
    <Image src={LoadingSopotan} quality={20} priority={true} width={200} loading="eager" alt="準備中そぽたん" />
    LOADING...
  </div>
</div>);