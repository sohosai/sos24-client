import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { hstack, stack, visuallyHidden } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { projectCategories, ProjectCategory } from "@/lib/valibot";
import { ProjectCategoryFormatter } from "@/components/ProjectCategoryFormatter";
import { basicErrorMessageStyle, projectCategoryItemStyle } from "./formFields/styles";

export const ProjectCategorySelector: FC<{
  register: UseFormRegisterReturn;
  error?: string;
}> = ({ register, error }) => {
  return (
    <fieldset className={stack({ gap: 2 })}>
      <div className={hstack()}>
        <legend className={css({ fontSize: "sm" })}>企画区分</legend>
        <span
          className={css({
            color: "gray.400",
            fontSize: "xs",
            fontWeight: "bold",
          })}>
          選択しない場合全ての企画が対象になります
        </span>
      </div>
      <div
        className={hstack({
          flexWrap: "wrap",
        })}>
        {projectCategories.map((category) => (
          <ProjectCategoryItem key={category} value={category} register={register} />
        ))}
      </div>
      {error && <span className={basicErrorMessageStyle}>{error}</span>}
    </fieldset>
  );
};

const ProjectCategoryItem: FC<{
  value: ProjectCategory;
  register: UseFormRegisterReturn;
}> = ({ value, register }) => {
  return (
    <label className={projectCategoryItemStyle}>
      <input type="checkbox" value={value} {...register} className={visuallyHidden()} />
      <span
        className={css({
          fontSize: "xs",
          fontWeight: "bold",
        })}>
        <ProjectCategoryFormatter category={value} />
      </span>
    </label>
  );
};