import { projectCategories, ProjectCategory } from "@/lib/valibot";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";
import { FC } from "react";
import { ProjectCategoryFormatter } from "@/components/ProjectCategoryFormatter";

export const CategoryBadges: FC<{
  categories: ProjectCategory[];
}> = ({ categories }) => {
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
          <ProjectCategoryFormatter category={category} />
        </span>
      ))}
    </span>
  );
};