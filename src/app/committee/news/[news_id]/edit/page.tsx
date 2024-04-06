"use client";

import { container, stack } from "@styled-system/patterns";
import Link from "next/link";
import { css } from "@styled-system/css";
import { EditNewsForm } from "@/app/committee/news/[news_id]/edit/EditNewsForm";
import { NextPage } from "next";

const EditNewsPage: NextPage<{ params: { news_id: string } }> = ({ params }) => {
  return (
    <div className={container({ maxWidth: "4xl" })}>
      <div className={stack({ gap: 8, marginY: 8 })}>
        <Link
          href="/committee/news"
          className={css({
            color: "sohosai.purple",
            fontSize: "xs",
          })}>
          ←お知らせ一覧に戻る
        </Link>
        <EditNewsForm news_id={params.news_id} />
      </div>
    </div>
  );
};

export default EditNewsPage;
