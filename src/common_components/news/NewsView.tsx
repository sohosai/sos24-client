import { flex, stack } from "@styled-system/patterns";
import { NewsList } from "@/common_components/news/NewsList";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { FC } from "react";
import { components } from "@/schema";
import { useRouter } from "next/navigation";
import { Button } from "@/common_components/Button";
import { css } from "@styled-system/css";
import Image from "next/image";
import Link from "next/link";
import plusIcon from "@/assets/Plus.svg?url";
import pulldownIcon from "@/assets/Pulldown.svg?url";
import { useAtomValue } from "jotai";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";

export interface SortStatus {
  status: "all" | "draft" | "scheduled" | "published";
}

// 対象の企画であるかを確認する
const isTargetProject = (
  myProject: components["schemas"]["Project"],
  targetCategories: components["schemas"]["ProjectCategory"][],
  targetAttributes: components["schemas"]["ProjectAttribute"][],
): boolean => {
  const doesCategoryMatch = targetCategories.includes(myProject.category);
  // stage には inside/outsite をつけないので、attribute ではフィルタしない
  const doesAttributeMatch = ["stage_united", "stage_1a", "stage_university_hall"].includes(myProject.category)
    ? true
    : targetAttributes.some((targetAttribute) => myProject.attributes.includes(targetAttribute));
  return doesCategoryMatch && doesAttributeMatch;
};

// 特定の企画向けのお知らせのみを抽出する
const filterNews = (
  myProject: components["schemas"]["Project"],
  newsList: components["schemas"]["NewsSummary"][],
): components["schemas"]["NewsSummary"][] => {
  const newsListPublished = newsList.filter((news) => news.state.includes("published"));
  return newsListPublished.filter((news) => isTargetProject(myProject, news.categories, news.attributes));
};

export type Props = {
  isCommittee?: boolean;
  isDashboard?: boolean;
};

// これはコンポーネントの規模ではないのではみたいな気持ちがある
export const NewsView: FC<Props & SortStatus> = ({ isCommittee, isDashboard = false, status }) => {
  const router = useRouter();

  const applicationPeriod = useAtomValue(projectApplicationPeriodAtom);

  const { data: data_user, isLoading: isLoading_user } = useSWR("/users/me");
  const me = assignType("/users/me", data_user);

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
  const newsListSort = newsList.sort((big, small) => descTimeSort(big.updated_at, small.updated_at));

  function descTimeSort(a: string, b: string) {
    return a < b ? 1 : -1;
  }

  const filteredNewsList = isCommittee
    ? newsListSort
    : filterNews(project, newsListSort).slice(0, isDashboard ? 5 : undefined);

  return (
    <div className={stack({ gap: 2, width: "full" })}>
      <div
        className={flex({
          justifyContent: isCommittee ? "end" : "space-between",
          alignItems: "center",
        })}>
        {!isCommittee && (
          <>
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
        {!isLoading_user &&
          isCommittee &&
          ["committee_drafter", "committee_editor", "committee_operator", "administrator"].includes(me.role) && (
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
        <NewsList newsList={filteredNewsList} isCommittee={isCommittee} status={status} />
      </div>
    </div>
  );
};
