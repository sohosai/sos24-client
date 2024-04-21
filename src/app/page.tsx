"use client";

import { container, stack } from "@styled-system/patterns";
import { Title } from "@/common_components/Title";
import { css } from "@styled-system/css";

export default function Home() {
  return (
    <div className={container()}>
      <div className={stack({ gap: 6, marginY: 8 })}>
        <div>
          <Title>第50回筑波大学学園祭 募集要項</Title>
        </div>
        <div className={stack({ gap: 2 })}>
          <p>第50回筑波大学学園祭「雙峰祭」は、対面で開催する予定でございます。</p>
          <p>
            雙峰祭での企画実施をお考えの方は、雙峰祭公式サイトで掲載している募集要項をご確認の上、期間内にご応募ください。
          </p>
          <p>詳しくはリンク先の資料をご覧下さい。</p>
        </div>
        <div className={stack({ gap: 2 })}>
          <a
            href="https://r2-2024.sohosai.com/20240422-general-application-guidelines.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ color: "tsukuba.purple", textDecoration: "underline", cursor: "pointer" })}>
            一般企画用募集要項 (PDF)
          </a>
          <a
            href="https://r2-2024.sohosai.com/20240422-stage-application-guidelines.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ color: "tsukuba.purple", textDecoration: "underline", cursor: "pointer" })}>
            ステージ企画用募集要項 (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
