import { flex, stack } from "@styled-system/patterns";
import { FilterSelector, NewsFilterType, newsFilters } from "@/common_components/news/FilterSelector";
import { NewsList } from "@/common_components/news/NewsList";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { FC, useCallback, useState } from "react";
import { components } from "@/schema";
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
const isTargetProject = (
  myProject: components["schemas"]["Project"],
  targetCategories: components["schemas"]["ProjectCategory"][],
  targetAttributes: components["schemas"]["ProjectAttribute"][],
): boolean => {
  const doesCategoryMatch = targetCategories.includes(myProject.category);
  const doesAttributeMatch = targetAttributes.some((targetAttribute) => myProject.attributes.includes(targetAttribute));
  return doesCategoryMatch && doesAttributeMatch;
};

// 特定の企画向けのお知らせのみを抽出する
const filterNews = (
  filter: NewsFilterType,
  myProject: components["schemas"]["Project"],
  newsList: components["schemas"]["NewsSummary"][],
): components["schemas"]["NewsSummary"][] => {
  switch (filter) {
    case "me":
      return newsList.filter((news) => isTargetProject(myProject, news.categories, news.attributes));
    case "all":
      return newsList;
  }
};

export const NewsView: FC<{
  isCommittee?: boolean;
  isDashboard?: boolean;
}> = ({ isCommittee, isDashboard = false }) => {
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
  const defaultFilter = newsFilters.includes(filterParams) ? filterParams : "me";
  const [filter, setFilter] = useState<NewsFilterType>(defaultFilter);

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
    ? newsList
    : filterNews(filter, project, newsList).slice(0, isDashboard ? 5 : undefined);

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
      <NewsList newsList={filteredNewsList} isCommittee={isCommittee} />
    </div>
  );
};
