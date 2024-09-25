"use client";

import { container, stack } from "@styled-system/patterns";
import Link from "next/link";
import { css } from "@styled-system/css";
import { NewNewsForm } from "@/app/committee/news/new/NewNewsForm";
import { NextPage } from "next";

const NewNewsPage: NextPage = () => {
  return (
    <div className={container({ maxWidth: "4xl" })}>
      <div className={stack({ gap: 8, marginY: 8 })}>
        <Link
          href="/committee/news"
          className={css({
            color: "tsukuba.purple",
            fontSize: "xs",
          })}>
          ←お知らせ一覧に戻る
        </Link>
        <NewNewsForm draft={null} />
      </div>
    </div>
  );
};

export default NewNewsPage;
