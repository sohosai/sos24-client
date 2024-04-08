import { css } from "@styled-system/css";
import dayjs from "dayjs";
import Link from "next/link";
import { flex } from "@styled-system/patterns";
import { CategoryBadges } from "@/components/CategoryBadges";
import { FC } from "react";
import { components } from "@/schema";

import { NoResultNotice } from "../NoResultNotice";

export const NewsList: FC<{
  newsList: components["schemas"]["NewsSummary"][];
  isCommittee?: boolean;
}> = ({ newsList, isCommittee }) => {
  return (
    <div>
      <div
        className={css({
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: "1fr 5fr",
          "& > * > *": {
            pl: 4,
            pr: 4,
            lineHeight: 3,
          },
        })}>
        <div
          className={css({
            display: "contents",
            "& > *": {
              borderColor: "gray.500",
              borderBottom: "1px solid",
            },
          })}>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>更新日</div>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>タイトル</div>
        </div>
        {newsList.length !== 0 ? (
          <>
            {newsList.map((news) => (
              <Link
                key={news.id}
                href={isCommittee ? `/committee/news/${news.id}` : `/news/${news.id}`}
                className={css({
                  display: "contents",
                  "& > *": {
                    borderColor: "gray.200",
                    borderBottom: "1px solid",
                  },
                })}>
                <div
                  className={css({
                    fontSize: "sm",
                    fontWeight: "bold",
                  })}>
                  {dayjs(news.updated_at).format("YYYY/MM/DD")}
                </div>
                <div
                  className={flex({
                    alignItems: "center",
                    gap: 4,
                    fontSize: "sm",
                  })}>
                  <span
                    className={css({
                      verticalAlign: "middle",
                    })}>
                    {news.title}
                  </span>
                  <CategoryBadges categories={news.categories} />
                </div>
              </Link>
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
      {newsList.length === 0 ? <NoResultNotice message="お知らせはありません" /> : <></>}
    </div>
  );
};
