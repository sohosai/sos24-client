"use client";

import { fetcherWithToken } from "@/lib/swr";
import { NextPage } from "next";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { NewsList } from "./NewsList";
import { css } from "@styled-system/css";

const DashboardPage: NextPage = () => {
  const { data: newsRes, error: newsLoading } = useSWR("/news", fetcherWithToken);
  const news = newsRes ? assignType("/news", newsRes.json) : undefined;

  return (
    <div
      className={css({
        padding: 5,
      })}>
      {!newsRes?.ok ? (
        <p>お知らせの取得中にエラーが発生しました(エラー: {String(newsRes?.statusCode)})</p>
      ) : (
        <NewsList
          newsList={[
            {
              id: "ID",
              title: "タイトル",
              updated_at: new Date().toISOString(),
            },
            {
              id: "ID",
              title: "タイトル",
              updated_at: new Date().toISOString(),
            },
          ]}
        />
      )}
    </div>
  );
};

export default DashboardPage;
