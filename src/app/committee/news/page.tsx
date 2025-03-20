"use client";

import { NextPage } from "next";
import { center, container, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { NewsView } from "@/common_components/news/NewsView";

const CommitteeNewsPage: NextPage = () => {
  return (
    <div className={container()}>
      <div className={stack({ gap: 8, marginY: 8 })}>
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>お知らせ一覧</h2>
        <div className={center()}>
          <div className={css({ width: "90%" })}>
            <NewsView isCommittee filterByState={"all"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeNewsPage;
