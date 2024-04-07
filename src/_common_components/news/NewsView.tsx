import { stack } from "@styled-system/patterns";
import {
  ProjectCategorySelector,
  SelectedCategoryType,
} from "@/_common_components/news/ProjectCategorySelector";
import { NewsList } from "@/_common_components/news/NewsList";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { useCallback, useState } from "react";
import { components } from "@/schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";

// 対象の企画であるかを確認する
const isTargetProject = (
  myProject: components["schemas"]["Project"],
  targetCategories: components["schemas"]["ProjectCategory"][],
  targetAttributes: components["schemas"]["ProjectAttribute"][],
): boolean => {
  const doesCategoryMatch = targetCategories.includes(myProject.category);
  const doesAttributeMatch = targetAttributes.some((targetAttribute) =>
    myProject.attributes.includes(targetAttribute)
  );
  return doesCategoryMatch && doesAttributeMatch;
};

// 特定の企画向けのお知らせのみを抽出する
const filterNews = (
  selectedCategory: SelectedCategoryType,
  myProject: components["schemas"]["Project"],
  newsList: components["schemas"]["NewsSummary"][],
): components["schemas"]["NewsSummary"][] => {
  switch (selectedCategory) {
    case "me":
      return newsList.filter((news) =>
        isTargetProject(myProject, news.categories, news.attributes)
      );
    case "all":
      return newsList;
  }
};

export const NewsView = () => {
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

  const defaultCategory =
    (searchParams.get("news_category") as SelectedCategoryType) ?? "me";
  const [selectedCategory, setSelectedCategory] = useState<
    SelectedCategoryType
  >(defaultCategory);

  const { data: newsData, error: newsError, isLoading: isLoadingNews } = useSWR(
    "/news",
  );
  const {
    data: projectData,
    error: projectError,
    isLoading: isLoadingProject,
  } = useSWR("/projects/me");
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

  const filteredNewsList = filterNews(selectedCategory, project, newsList);

  return (
    <div className={stack({ gap: 2, width: "full" })}>
      <ProjectCategorySelector
        selected={selectedCategory}
        setSelected={(category) => {
          setSelectedCategory(category);
          router.push(
            (pathname + "?" +
              createQueryString("news_category", category)) as Route,
          );
        }}
      />
      <NewsList newsList={filteredNewsList} />
    </div>
  );
};
