import { ProjectAttribute, ProjectCategory } from "./valibot";

export const getProjectCategoryText = (category: ProjectCategory) => {
  switch (category) {
    case "general":
      return "普通企画";
    case "foods_with_kitchen":
      return "調理企画（仕込場必要）";
    case "foods_without_kitchen":
      return "調理企画（仕込場不要）";
    case "foods_without_cooking":
      return "既製食品販売企画";
    case "stage_1a":
      return "ステージ企画（1Aステージ）";
    case "stage_united":
      return "ステージ企画（UNITEDステージ）";
    case "stage_university_hall":
      return "ステージ企画（大学会館ステージ）";
  }
};

export const getProjectAttributeText = (attribute: ProjectAttribute) => {
  switch (attribute) {
    case "academic":
      return "学術参加枠";
    case "art":
      return "芸術祭参加枠";
    case "official":
      return "委員会企画";
    case "inside":
      return "屋内企画";
    case "outside":
      return "屋外企画";
  }
};
