import { flex, stack } from "@styled-system/patterns";
import { FilterSelector, NewsFilterMeOrAllType, newsFiltersMeOrAll } from "@/common_components/news/FilterSelector";
import { NewsList } from "@/common_components/news/NewsList";
import { filterNewsByCommitee, filterNewsByState, stateType } from "@/common_components/news/FilterNewsList";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { FC, useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";
import { Button } from "@/common_components/Button";
import { css } from "@styled-system/css";
import Image from "next/image";
import Link from "next/link";
import plusIcon from "@/assets/Plus.svg?url";
import pulldownIcon from "@/assets/Pulldown.svg?url";
import { useAtomValue } from "jotai";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";

// 対象の企画であるかを確認する
export type Props = {
  isCommittee?: boolean;
  isDashboard?: boolean;
  filterByState?: stateType;
};

// これはコンポーネントの規模ではないのではみたいな気持ちがある
export const NewsView: FC<Props> = ({ isCommittee, isDashboard = false, filterByState = "all" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  const applicationPeriod = useAtomValue(projectApplicationPeriodAtom);

  const filterParams = (searchParams.get("news_cateogry") ?? "me") as "me" | "all";
  const defaultFilter = newsFiltersMeOrAll.includes(filterParams) ? filterParams : "me";
  const [filter, setFilter] = useState<NewsFilterMeOrAllType>(defaultFilter);
  const { data: newsData, error: newsError, isLoading: isLoadingNews } = useSWR("/news");
  const { data: projectData, error: projectError, isLoading: isLoadingProject } = useSWR("/projects/me");
  if (isLoadingNews || isLoadingProject) {
    return;
  }
  if (newsError) {
    return <p>お知らせの読み込み中に不明なエラーが発生しました。</p>;
  }
  if (!isCommittee && projectError) {
    return <p>企画の読み込み中に不明なエラーが発生しました。</p>;
  }

  const project = assignType("/projects/me", projectData);
  const newsList = assignType("/news", newsData);

  const filteredNewsList = isCommittee
    ? filterNewsByState(filterByState, newsList) //.filter((e) => attributesFilter === "" || e.attributes.includes(attributesFilter))
    : filterNewsByCommitee(filter, project, newsList).slice(0, isDashboard ? 5 : undefined);

  return (
    <div className={stack({ gap: 2, width: "full" })}>
      <div
        className={flex({
          justifyContent: isCommittee ? "end" : "space-between",
          alignItems: "center",
        })}>
        {!isCommittee && (
          <>
            <FilterSelector
              filter={filter}
              setFilter={(filter) => {
                setFilter(filter);
                router.push((pathname + "?" + createQueryString("news_category", filter)) as Route);
              }}
            />

            {isDashboard && !applicationPeriod.isIn && (
              <Link
                href="/news"
                className={flex({
                  backgroundColor: "tsukuba.purple",
                  borderRadius: 2,
                  paddingX: 4,
                  paddingY: 1,
                  gap: 2,
                })}>
                <Image
                  src={pulldownIcon}
                  alt=""
                  className={css({
                    display: "block",
                    height: "auto",
                  })}
                />
                <span
                  className={css({
                    color: "white",
                    fontSize: "xs",
                    fontWeight: "bold",
                  })}>
                  お知らせ一覧へ
                </span>
              </Link>
            )}
          </>
        )}
        {isCommittee && (
          <>
            <Button
              color="blue"
              onClick={() => router.push("/committee/news/new")}
              className={flex({
                alignItems: "center",
                gap: 2,
                paddingX: 6,
              })}>
              <Image src={plusIcon} alt="" />
              <span
                className={css({
                  fontSize: "xs",
                  fontWeight: "bold",
                })}>
                新規作成
              </span>
            </Button>
          </>
        )}
      </div>
      <div
        className={css({
          marginBottom: "60px",
          md: {
            marginBottom: 0,
          },
        })}>
        <NewsList newsList={filteredNewsList} isCommittee={isCommittee} /> {/*filterd～をちゃんと絞ったやつにする*/}
      </div>
    </div>
  );
};
