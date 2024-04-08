import { flex, stack } from "@styled-system/patterns";
import Link from "next/link";
import { css } from "@styled-system/css";
import dayjs from "dayjs";
import Image from "next/image";
import triangleIcon from "@/components/assets/Triangle.svg";
import { FileItem } from "@/components/news/FileItem";
import { components } from "@/schema";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { FC } from "react";

export const News: FC<{
  news: components["schemas"]["News"];
  isCommittee?: boolean;
}> = ({ news, isCommittee }) => {
  const router = useRouter();

  return (
    <div
      className={stack({
        gap: 3,
        marginY: 8,
      })}>
      <Link
        href={isCommittee ? "/committee/news" : "/news"}
        className={css({
          color: "sohosai.purple",
          fontSize: "xs",
        })}>
        ←お知らせ一覧に戻る
      </Link>
      <p
        className={css({
          fontSize: "xs",
        })}>
        最終更新: {dayjs(news.updated_at).format("YYYY/MM/DD")}
      </p>
      <div
        className={flex({
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        })}>
        <h2
          className={css({
            fontSize: "2xl",
            fontWeight: "bold",
          })}>
          {news.title}
        </h2>
        {isCommittee && (
          <Button
            color="blue"
            className={flex({
              verticalAlign: "middle",
            })}
            onClick={() => router.push(`/committee/news/${news.id}/edit`)}>
            <span
              className={css({
                fontSize: "xs",
                fontWeight: "bold",
              })}>
              編集
            </span>
          </Button>
        )}
      </div>
      <hr
        className={css({
          borderColor: "gray.200",
          borderWidth: 1,
        })}
      />
      <pre
        className={css({
          fontSize: "sm",
        })}>
        {news.body}
      </pre>
      <h3
        className={flex({
          marginTop: 8,
          gap: 3,
        })}>
        <Image src={triangleIcon} alt="" />
        <span
          className={css({
            fontSize: "md",
            fontWeight: "bold",
          })}>
          添付ファイル
        </span>
      </h3>
      <div
        className={stack({
          gap: 2,
        })}>
        {news.attachments.map((file_id) => (
          <FileItem key={file_id} file_id={file_id} />
        ))}
      </div>
    </div>
  );
};
