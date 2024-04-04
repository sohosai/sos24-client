"use client";

import { NextPage } from "next";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { NewsList } from "./NewsList";
import { css } from "@styled-system/css";

const DashboardPage: NextPage = () => {
  const { data: newsRes } = useSWR("/news");
  const news = newsRes ? assignType("/news", newsRes.json) : undefined;

  return (
    <div
      className={css({
        padding: 5,
      })}>
      {!newsRes?.ok ? (
        <p>お知らせの取得中にエラーが発生しました(エラー: {String(newsRes?.statusCode)})</p>
      ) : (
        <NewsList newsList={news ?? []} />
      )}
    </div>
  );
};

export default DashboardPage;
