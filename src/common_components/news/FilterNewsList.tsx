import { components } from "@/schema";
import { NewsFilterMeOrAllType } from "@/common_components/news/FilterSelector";

const isTargetProject = (
  myProject: components["schemas"]["Project"],
  targetCategories: components["schemas"]["ProjectCategory"][],
  targetAttributes: components["schemas"]["ProjectAttribute"][],
  targetState: components["schemas"]["NewsState"],
): boolean => {
  const doesCategoryMatch = targetCategories.includes(myProject.category);
  const doesAttributeMatch = targetAttributes.some((targetAttribute) => myProject.attributes.includes(targetAttribute));
  const doesStatePublished = targetState.includes("published");
  return doesCategoryMatch && doesAttributeMatch && doesStatePublished;
};

// 特定の企画向けのお知らせのみを抽出する
export const filterNewsNotCommitee = (
  filter: NewsFilterMeOrAllType,
  myProject: components["schemas"]["Project"],
  newsList: components["schemas"]["NewsSummary"][],
): components["schemas"]["NewsSummary"][] => {
  switch (filter) {
    case "me":
      return newsList.filter((news) => isTargetProject(myProject, news.categories, news.attributes, news.state));
    //一つ目が基準　残り二つがそれぞれのパラメータ
    case "all":
      return newsList.filter((news) => news.state.includes("published"));
  }
};

const isTargetProjectByState = (
  //基準
  choosenState: components["schemas"]["NewsState"], //絞り込みでクリックしたStateになる
  targetStates: components["schemas"]["NewsState"], //絞り込みの対象となるNewsのState
): boolean => {
  const doesStateMatch = targetStates.includes(choosenState);
  return doesStateMatch;
};

export type stateType = "all" | "published" | "draft" | "scheduled";
// 特定の企画向けのお知らせのみを抽出する
export const filterNewsByState = (
  filter: stateType,
  newsList: components["schemas"]["NewsSummary"][],
): components["schemas"]["NewsSummary"][] => {
  switch (filter) {
    //filter の挙動がわからん filterが一つ("all")になるっぽい
    case "all":
      return newsList;
    case "published":
      return newsList.filter((news) => isTargetProjectByState("published", news.state));
    case "draft":
      return newsList.filter((news) => isTargetProjectByState("draft", news.state));
    case "scheduled":
      return newsList.filter((news) => isTargetProjectByState("scheduled", news.state));
  }
};
