import { projectCategories, ProjectCategory } from "@/lib/valibot";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";

export const categoryToLabel = (category: ProjectCategory): string => {
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
  // unreachable
  return "";
};

interface CategoryBadgesProps {
  categories: ProjectCategory[];
}

export const CategoryBadges = ({ categories }: CategoryBadgesProps) => {
  const badgeStyle = css({
    color: "gray.600",
    fontSize: "xs",
    fontWeight: "bold",
    lineHeight: 2,
    backgroundColor: "gray.200",
    paddingX: 2,
  });

  const isToAllCategory = projectCategories.every((it) => categories.includes(it));
  if (isToAllCategory) {
    return <span className={badgeStyle}>すべての企画</span>;
  }

  return (
    <span className={flex({ gap: 2 })}>
      {categories.map((category) => (
        <span key={category} className={badgeStyle}>
          {categoryToLabel(category)}
        </span>
      ))}
    </span>
  );
};
