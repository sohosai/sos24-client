import { projectCategories, ProjectCategory } from "@/lib/valibot";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";
import { FC } from "react";
import { ProjectCategoryFormatter } from "@/common_components/ProjectCategoryFormatter";

export const CategoryBadges: FC<{
  categories: ProjectCategory[];
}> = ({ categories }) => {
  const badgeStyle = css({
    color: "gray.600",
    fontSize: "xs",
    fontWeight: "bold",
    lineHeight: 1.6,
    backgroundColor: "gray.200",
    paddingX: 2,
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    width: "fit-content",
    smDown: {
      gridColumn: "2/3",
      gridRow: "1/2",
      fontSize: "2xs",
      height: 4,
    },
  });

  const isToAllCategory = projectCategories.every((it) => categories.includes(it));
  if (isToAllCategory) {
    return <span className={badgeStyle}>すべての企画</span>;
  }

  return (
    <span className={flex({ gap: 2, wrap: "wrap" })}>
      {categories.map((category) => (
        <span key={category} className={badgeStyle}>
          <ProjectCategoryFormatter category={category} />
        </span>
      ))}
    </span>
  );
};
