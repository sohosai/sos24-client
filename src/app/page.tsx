"use client";

import { container, stack } from "@styled-system/patterns";
import { Title } from "@/common_components/Title";
import { css } from "@styled-system/css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={container()}>
      <div className={stack({ gap: 6, marginY: 8 })}>
        <div>
          <Title>第50回筑波大学学園祭 企画募集</Title>
        </div>
        <div className={stack({ gap: 3 })}>
          <div>
            <p>筑波大学学園祭「雙峰祭」の企画を募集いたします。</p>
            <p>企画に応募される方は、募集要項をご確認の上、企画募集期間中にご応募ください。</p>
          </div>
          <div>
            <p>企画募集期間</p>
            <p>4月22日(月)9:00〜5月10日(金)23:59</p>
          </div>
          <div>
            <p>募集要項は以下のリンクからご確認いただけます。</p>
            <div className={stack({ gap: 0 })}>
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
          <div>
            <p>応募方法</p>
            <p>雙峰祭オンラインシステムよりご応募いただけます。</p>
            <p>
              アカウント作成方法を
              <Link
                href="/how-to-use"
                className={css({
                  color: "tsukuba.purple",
                  textDecoration: "underline",
                  cursor: "pointer",
                })}>
                こちら
              </Link>
              にて動画でご案内しております。
            </p>
          </div>
          <div>
            <p>学園祭実行委員会一同、素晴らしい雙峰祭を皆様と築いていけることを心より楽しみにしております。</p>
            <p>ご応募お待ちしております。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
