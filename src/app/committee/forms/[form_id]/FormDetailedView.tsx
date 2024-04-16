"use client";
import { ProjectCategoryFormatter } from "@/components/ProjectCategoryFormatter";
import { projectCategoryItemStyle } from "@/components/formFields/styles";
import { projectAttributes, projectCategories } from "@/lib/valibot";
import { components } from "@/schema";
import { css } from "@styled-system/css";
import { hstack, vstack } from "@styled-system/patterns";
import dayjs from "dayjs";
import { LabelAndTime } from "./LabelAndTime";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FilesFormType, FormItems } from "@/app/forms/[form_id]/FormItems";
import { FormAnswerList } from "./FormAnswerList";
import { attributeSelectorStyle } from "../../projects/[project_id]/edit/ProjectEditForm";
import { AttributesFormatter } from "@/components/project/AttributesFormatter";

export const FormDetailedView: React.FC<{ form: components["schemas"]["Form"] }> = ({ form }) => {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const [_, setState] = useState<FilesFormType>(new Map());
  const [__, setFileErrors] = useState(new Map());

  return (
    <div className={vstack({ gap: 4, alignItems: "start", width: "full" })}>
      <div>
        作成日: <time dateTime={form.created_at}> {dayjs(form.created_at).format("YYYY/MM/DD")}</time>
      </div>
      <div className={hstack({ gap: 6 })}>
        <h1 className={css({ fontSize: "3xl", fontWeight: "bold" })}>{form.title}</h1>
        <div className={hstack()}>
          <ul className={hstack()}>
            {/* 同じカテゴリが複数入ることはないと信じている */}
            {form.categories.length == projectCategories.length ? (
              <li className={projectCategoryItemStyle}>すべての企画区分</li>
            ) : (
              form.categories.map((category) => (
                <li key={category} className={projectCategoryItemStyle}>
                  <ProjectCategoryFormatter category={category} />
                </li>
              ))
            )}
          </ul>
          {form.attributes.length == projectAttributes.length ? (
            <span className={attributeSelectorStyle}>すべての企画属性</span>
          ) : (
            <>
              {form.attributes.map((attribute) => (
                <span key={attribute} className={attributeSelectorStyle}>
                  <AttributesFormatter attribute={attribute} />
                </span>
              ))}
            </>
          )}
        </div>
      </div>
      <div className={css({ width: "full" })}>
        <label className={css({ fontWeight: "bold", fontSize: "lg" })} htmlFor="form-description">
          説明
        </label>
        <textarea
          value={form.description}
          id="form-description"
          disabled
          className={css({ width: "full", borderRadius: "lg", padding: 5 })}
        />
      </div>
      <>{form.attachments.forEach((file) => file)}</>
      <div className={vstack({ gap: 2, alignItems: "start" })}>
        <LabelAndTime label="受付開始日時" time={form.starts_at} />
        <LabelAndTime label="受付終了日時" time={form.ends_at} />
      </div>
      <form
        className={css({
          marginBlock: 10,
          display: "flex",
          flexDirection: "column",
          width: "full",
          rowGap: 3,
        })}>
        <FormItems
          items={form.items}
          getValues={getValues}
          setValue={setValue}
          register={register}
          errors={errors}
          files={new Map()}
          setFiles={setState}
          setFileErrors={setFileErrors}
        />
      </form>
      <FormAnswerList formId={form.id} deadline={form.ends_at} />
    </div>
  );
};
