"use client";

import { NextPage } from "next";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { NewsList } from "./NewsList";
import { css } from "@styled-system/css";
import { ProjectView } from "@/app/dashboard/ProjectView";
import { Title } from "@/components/Title";
import { container } from "@styled-system/patterns";

const DashboardPage: NextPage = () => {
  const { data: newsRes } = useSWR("/news");
  const news = newsRes ? assignType("/news", newsRes) : undefined;

  return (
    <div className={container()}>
      <Title>企画情報</Title>
      <ProjectView />
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
    </div>
  );
};

export default DashboardPage;
