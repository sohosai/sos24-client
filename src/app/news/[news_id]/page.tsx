"use client";

import { container, flex, stack } from "@styled-system/patterns";
import Link from "next/link";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import dayjs from "dayjs";
import Image from "next/image";

import triangleIcon from "@/_common_components/assets/Triangle.svg";
import { css } from "@styled-system/css";
import { FileItem } from "@/_common_components/news/FileItem";

export const runtime = "edge";

const NewsDetailsPage = ({ params }: { params: { news_id: string } }) => {
  const { data, error, isLoading } = useSWR(`/news/${params.news_id}`);
  if (isLoading) {
    return;
  }
  if (error) {
    switch (error.name) {
      case "news/not-found":
        return <p>このお知らせは存在しません。</p>;
      default:
        return <p>お知らせの読み込み中に不明なエラーが発生しました。</p>;
    }
  }

  const news = assignType("/news/{news_id}", data);

  return (
    <div className={container({ maxWidth: "4xl" })}>
      <div
        className={stack({
          gap: 3,
          marginY: 8,
        })}
      >
        <Link
          href="/news"
          className={css({
            color: "sohosai.purple",
            fontSize: "xs",
          })}
        >
          ←お知らせ一覧に戻る
        </Link>
        <p
          className={css({
            fontSize: "xs",
          })}
        >
          最終更新: {news && dayjs(news.updated_at).format("YYYY/MM/DD")}
        </p>
        <h2
          className={css({
            fontSize: "2xl",
            fontWeight: "bold",
            marginBottom: 2,
          })}
        >
          {news?.title}
        </h2>
        <hr
          className={css({
            borderColor: "gray.200",
            borderWidth: 1,
          })}
        />
        <pre
          className={css({
            fontSize: "sm",
          })}
        >
          {news?.body}
        </pre>
        <h3
          className={flex({
            marginTop: 8,
            gap: 3,
          })}
        >
          <Image src={triangleIcon} alt="" />
          <span
            className={css({
              fontSize: "md",
              fontWeight: "bold",
            })}
          >
            添付ファイル
          </span>
        </h3>
        <div className={stack({ gap: 2 })}>
          {news?.attachments.map((file_id) => (
            <FileItem key={file_id} file_id={file_id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsPage;
