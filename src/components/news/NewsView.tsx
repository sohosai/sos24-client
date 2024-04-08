import { flex, stack } from "@styled-system/patterns";
import { FilterSelector, NewsFilterType } from "@/components/news/FilterSelector";
import { NewsList } from "@/components/news/NewsList";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { FC, useCallback, useState } from "react";
import { components } from "@/schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";
import { Button } from "@/components/Button";
import { css } from "@styled-system/css";
import Image from "next/image";
import plusIcon from "@/components/assets/Plus.svg";

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
}> = ({ isCommittee }) => {
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

  const defaultFilter = (searchParams.get("news_category") ?? "me") as NewsFilterType;
  const [filter, setFilter] = useState<NewsFilterType>(defaultFilter);

  const { data: newsData, error: newsError, isLoading: isLoadingNews } = useSWR("/news");
  const { data: projectData, error: projectError, isLoading: isLoadingProject } = useSWR("/projects/me");
  if (isLoadingNews || isLoadingProject) {
    return;
  }
  if (newsError) {
    return <p>お知らせの読み込み中に不明なエラーが発生しました。</p>;
  }
  if (projectError) {
    return <p>企画の読み込み中に不明なエラーが発生しました。</p>;
  }

  const project = assignType("/projects/me", projectData);
  const newsList = assignType("/news", newsData);

  const filteredNewsList = filterNews(filter, project, newsList);

  return (
    <div className={stack({ gap: 2, width: "full" })}>
      <div
        className={flex({
          justifyContent: isCommittee ? "end" : "space-between",
        })}>
        {!isCommittee && (
          <FilterSelector
            filter={filter}
            setFilter={(filter) => {
              setFilter(filter);
              router.push((pathname + "?" + createQueryString("news_category", filter)) as Route);
            }}
          />
        )}
        {isCommittee && (
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
        )}
      </div>
      <NewsList newsList={isCommittee ? newsList : filteredNewsList} isCommittee={isCommittee} />
    </div>
  );
};
