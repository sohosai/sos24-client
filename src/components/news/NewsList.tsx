import { css } from "@styled-system/css";
import dayjs from "dayjs";
import Link from "next/link";
import { CategoryBadges } from "@/components/CategoryBadges";
import { FC } from "react";
import { components } from "@/schema";

export const NewsList: FC<{
  newsList: components["schemas"]["NewsSummary"][];
  isCommittee?: boolean;
}> = ({ newsList, isCommittee }) => {
  return (
    <div>
      <div
        className={css({
          sm: {
            display: "grid",
            alignItems: "center",
            gridTemplateColumns: "1fr 5fr",
            "& > * > *": {
              pl: 4,
              pr: 4,
              lineHeight: 3,
            },
            gap: 0,
          },
          base: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
          },
        })}>
        <div
          className={css({
            display: { sm: "contents", base: "none" },
            "& > *": {
              borderColor: "gray.500",
              borderBottom: "1px solid",
            },
          })}>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>更新日</div>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>タイトル</div>
        </div>

        {newsList.map((news) => (
          <Link
            key={news.id}
            href={isCommittee ? `/committee/news/${news.id}` : `/news/${news.id}`}
            className={css({
              sm: {
                display: "contents",
                "& > *": {
                  borderColor: "gray.200",
                  borderBottom: "1px solid",
                },
              },
              base: {
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gridTemplateRows: "auto auto",
                columnGap: 3,
                rowGap: 1,
                paddingY: 2,
              },
            })}>
            <div
              className={css({
                fontSize: "sm",
                fontWeight: "bold",
                height: "100%",
                display: "flex",
                alignItems: "center",
                smDown: {
                  gridColumn: "1/2",
                  gridRow: "1/2",
                },
              })}>
              <span>{dayjs(news.updated_at).format("YYYY/MM/DD")}</span>
            </div>
            <div
              className={css({
                display: { sm: "flex", base: "contents" },
                alignItems: "center",
                gap: 4,
                fontSize: "sm",
                height: "100%",
                paddingY: 1,
              })}>
              <span
                className={css({
                  verticalAlign: "middle",
                  lineHeight: 1.6,
                  smDown: {
                    gridColumn: "1/3",
                    gridRow: "2/3",
                    paddingY: 2,
                  },
                })}>
                {news.title}
              </span>
              <CategoryBadges categories={news.categories} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};