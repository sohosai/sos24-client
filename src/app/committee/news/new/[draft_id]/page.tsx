"use client";

import { container, stack } from "@styled-system/patterns";
import Link from "next/link";
import { css } from "@styled-system/css";
import { NewNewsForm } from "@/app/committee/news/new/NewNewsForm";
import { NextPage } from "next";

export const runtime = "edge";

const NewNewsPage: NextPage<{ params: { draft_id: string } }> = ({ params }) => {
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
        <NewNewsForm draft={params.draft_id} />
      </div>
    </div>
  );
};

export default NewNewsPage;
