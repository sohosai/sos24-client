import { css } from "@styled-system/css";
import dayjs from "dayjs";
import Link from "next/link";
import { CategoryBadges } from "@/common_components/CategoryBadges";
import { FC } from "react";
import { ProjectCategory } from "@/lib/valibot";
import Image from "next/image";
import arrowIcon from "@/assets/Arrow.svg?url";
import { NoResultNotice } from "@/common_components/NoResultNotice";

type News = {
  id: string;
  title: string;
  categories: ProjectCategory[];
  updated_at: string;
};

export const NewsList: FC<{
  newsList: News[];
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

        {newsList.length !== 0 ? (
          newsList.map((news) => (
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
                  borderBlockEnd: 4,
                  borderStyle: "dotted",
                  borderColor: "gray.200",
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
                    height: "auto",
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
                      display: "flex",
                      gap: 1,
                      gridColumn: "1/3",
                      gridRow: "2/3",
                      paddingY: 2,
                    },
                  })}>
                  <Image
                    src={arrowIcon}
                    alt=""
                    className={css({
                      display: { base: "inline-block", sm: "none" },
                      color: "tsukuba.purple",
                    })}
                  />

                  {news.title}
                </span>
                <CategoryBadges categories={news.categories} />
              </div>
            </Link>
          ))
        ) : (
          <></>
        )}
      </div>
      {newsList.length === 0 ? <NoResultNotice message="お知らせはありません" type="notice" /> : <></>}
    </div>
  );
};
