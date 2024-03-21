import { css } from "@styled-system/css";
import dayjs from "dayjs";
import { FC } from "react";

type News = {
  id: string;
  title: string;
  updated_at: string;
};

export const NewsList: FC<{ newsList: News[] }> = ({ newsList }) => {
  return (
    <div>
      <h2 className={css({ fontSize: "2xl", fontWeight: 700 })}>お知らせ</h2>
      <div
        className={css({
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: "max-content 1fr",
          "& > * > *": {
            pr: 4,
            lineHeight: 2,
          },
        })}>
        <div
          className={css({
            display: "contents",
            color: "gray.500",
            "& > *": {
              borderColor: "gray.500",
              borderBottom: "1px solid",
            },
          })}>
          <div>更新日</div>
          <div>タイトル</div>
        </div>

        {newsList.map((news) => {
          return (
            <a
              key={news.id}
              href={`/news/${news.id}`}
              className={css({
                display: "contents",
              })}>
              <div>{dayjs(news.updated_at).format("YYYY/MM/DD")}</div>
              <div>{news.title}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
