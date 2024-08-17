"use client";

import { container } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { News } from "@/common_components/news/News";
import { NextPage } from "next";
import { notFound } from "next/navigation";

export const runtime = "edge";

const NewsDetailsPage: NextPage<{ params: { news_id: string } }> = ({ params }) => {
  const { data, error, isLoading } = useSWR(`/news/${params.news_id}`);
  if (isLoading) {
    return;
  }
  if (error) {
    switch (error.name) {
      case "news/not-found":
      case "news/invalid-uuid":
        notFound();
      default:
        return <p>お知らせの読み込み中に不明なエラーが発生しました。</p>;
    }
  }

  const news = assignType("/news/{news_id}", data);

  return (
    <div className={container({ maxWidth: "4xl" })}>
      <div
        className={css({
          marginBottom: "60px",
          md: {
            marginBottom: 0,
          },
        })}>
        <News news={news} />
      </div>
    </div>
  );
};

export default NewsDetailsPage;
