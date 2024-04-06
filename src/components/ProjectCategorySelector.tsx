import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { hstack, stack, visuallyHidden } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { projectCategories, ProjectCategory } from "@/lib/valibot";
import { basicErrorMessageStyle } from "@/components/forms/styles";
import { ProjectCategoryFormatter } from "@/components/ProjectCategoryFormatter";

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
          <CategoryFieldItem key={category} value={category} register={register} />
        ))}
      </div>
      {error && <span className={basicErrorMessageStyle}>{error}</span>}
    </fieldset>
  );
};

const CategoryFieldItem: FC<{
  value: ProjectCategory;
  register: UseFormRegisterReturn;
}> = ({ value, register }) => {
  return (
    <label
      className={hstack({
        paddingBlock: 1,
        paddingInline: 4,
        borderRadius: 10,
        cursor: "pointer",

        color: "gray.600",
        backgroundColor: "gray.200",
        "&:has(> input:checked)": {
          color: "white",
          backgroundColor: "sohosai.purple",
        },
      })}>
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
