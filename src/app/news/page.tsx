"use client";

import {container, stack} from "@styled-system/patterns";
import {css} from "@styled-system/css";
import {NewsView} from "@/components/news/NewsView";

const NewsPage = () => {
  return (
    <div className={container()}>
      <div className={stack({gap: 8, marginY: 8})}>
        <h2 className={css({fontSize: "2xl", fontWeight: "bold"})}>お知らせ一覧</h2>
        <NewsView/>
      </div>
    </div>
  );
};

export default NewsPage;
