import { css } from "@styled-system/css";
import dayjs from "dayjs";
import { FC } from "react";
import Link from "next/link";
import { ProjectCategory } from "@/lib/valibot";
import { center, flex } from "@styled-system/patterns";
import { CategoryBadges } from "@/components/news/CategoryBadges";
import Image from "next/image";

import SuyasuyaBellIcon from "../assets/SuyasuyaBell.png";
import { NoResultNotice } from "../NoResultNotice";
type News = {
  id: string;
  title: string;
  categories: ProjectCategory[];
  updated_at: string;
};

export const NewsList: FC<{ newsList: News[] }> = ({ newsList }) => {
  console.log(newsList);
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
                href={`/news/${news.id}`}
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
