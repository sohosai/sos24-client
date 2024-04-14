import Image from "next/image";

import notFoundSopotan from "@/components/assets/notFoundSopotan.png";
import { css } from "@styled-system/css";
import { box, center, hstack, vstack } from "@styled-system/patterns";
export default function NotFoundPage() {
  return (
    <div className={center({ w: "full", mt: 48 })}>
      <div className={hstack({ gap: 24 })}>
        <Image
          src={notFoundSopotan}
          alt=""
          className={css({
            height: 60,
            width: 60,
            mt: 5,
          })}
        />
        <div className={box({ width: "390px" })}>
          <div className={vstack({ gap: 12 })}>
            <span className={css({ fontSize: "24px", fontWeight: "600" })}>お探しのページが見つかりません。</span>
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
}
