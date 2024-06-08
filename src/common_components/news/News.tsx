import { flex, hstack, stack } from "@styled-system/patterns";
import Link from "next/link";
import { css } from "@styled-system/css";
import dayjs from "dayjs";
import Image from "next/image";
import triangleIcon from "@/assets/Triangle.svg?url";
import { FileItem } from "@/common_components/news/FileItem";
import { components } from "@/schema";
import { Button } from "@/common_components/Button";
import { useRouter } from "next/navigation";
import { FC } from "react";
import deleteNewsButton from "@/assets/deleteNewsButton.svg?url";
import { client } from "@/lib/openapi";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";

export const News: FC<{
  news: components["schemas"]["News"];
  isCommittee?: boolean;
}> = ({ news, isCommittee }) => {
  const router = useRouter();
  const applicationPeriod = useAtomValue(projectApplicationPeriodAtom);

  return (
    <div
      className={stack({
        gap: 3,
        marginY: 8,
      })}>
      <Link
        href={isCommittee ? "/committee/news" : applicationPeriod.isIn ? "/dashboard" : "/news"}
        className={css({
          color: "tsukuba.purple",
          fontSize: "xs",
        })}>
        {isCommittee || !applicationPeriod.isIn ? "←お知らせ一覧に戻る" : "←戻る"}
      </Link>
      <p
        className={css({
          fontSize: "xs",
        })}>
        最終更新: {dayjs(news.updated_at).format("YYYY/MM/DD HH:mm")}
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
          <div className={hstack()}>
            <Image
              src={deleteNewsButton}
              alt=""
              className={css({ cursor: "pointer", pt: 2 })}
              onClick={() => {
                window.confirm("本当に削除しますか？") &&
                  toast.promise(
                    client
                      .DELETE("/news/{news_id}", {
                        params: {
                          path: {
                            news_id: news.id,
                          },
                        },
                      })
                      .then(({ error }) => {
                        if (error) {
                          throw error;
                        }
                        router.push("/committee/news");
                      })
                      .catch((e) => {
                        throw e;
                      }),
                    {
                      loading: "お知らせを削除しています",
                      success: "お知らせを削除しました",
                      error: "お知らせの削除に失敗しました",
                    },
                  );
              }}
            />
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
          </div>
        )}
      </div>
      <hr
        className={css({
          borderColor: "gray.200",
          borderWidth: 1,
        })}
      />
      <div
        className={css({
          fontSize: "sm",
          whiteSpace: "pre-wrap",
        })}>
        {news.body}
      </div>
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
