"use client";
import { ProjectCategoryFormatter } from "@/components/ProjectCategoryFormatter";
import { projectCategories } from "@/lib/valibot";
import { css, cx } from "@styled-system/css";
import { hstack, visuallyHidden } from "@styled-system/patterns";
import { UseFormRegisterReturn } from "react-hook-form";

export const ProjectCategoryEditor: React.FC<{ register: UseFormRegisterReturn }> = ({ register }) => {
  return (
    <div className={hstack({ flexWrap: "wrap" })}>
      {projectCategories.map((category) => (
        <label
          key={category}
          className={cx(
            css({
              paddingBlock: 2,
              paddingInline: 6,
              borderRadius: "2xl",
              cursor: "pointer",
              color: "gray.600",
              backgroundColor: "gray.200",
              fontSize: "sm",
              fontWeight: "bold",
              boxSizing: "border-box",
              "&:has(> input:checked)": {
                color: "sohosai.purple",
                outline: "2px solid ",
                backgroundColor: "white",
              },
            }),
          )}>
          <ProjectCategoryFormatter category={category} />
          <input type="radio" value={category} className={visuallyHidden()} {...register} />
        </label>
      ))}
    </div>
  );
};
