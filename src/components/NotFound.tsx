import { FC } from "react";
import Image from "next/image";

import notFoundSopotan from "@/components/assets/notFoundSopotan.png";
import { css } from "@styled-system/css";
import { box, center, flex } from "@styled-system/patterns";

interface Props {
  message?: string;
}

export const NotFound: FC<Props> = ({ message = "お探しのページが見つかりません。" }: Props) => (
  <div className={center({ w: "full", h: "calc(85vh)" })}>
    <div className={flex({ align: "center", direction: { sm: "row", base: "column" }, gap: { sm: "4vw", base: 5 } })}>
      <Image
        src={notFoundSopotan}
        alt=""
        className={css({
          width: 60,
          height: "auto",
          mt: 5,
        })}
      />
      <div className={box({ maxW: "390px", paddingX: 3 })}>
        <div className={flex({ gap: 8, align: "start", direction: "column" })}>
          <span className={css({ fontSize: "24px", fontWeight: "600" })}>{message}</span>
          <span
            className={css({
              textAlign: "left",
              color: "gray.500",
              fontSize: "15px",
              fontWeight: "700",
              h: "87px",
              lineHeight: "2",
            })}>
            アクセスしようとしたページは移動または削除されたか、 <br />
            現在利用できない可能性があります。 <br />
            また、URLにタイプミスがないか再度ご確認ください。
          </span>
        </div>
      </div>
    </div>
  </div>
);
