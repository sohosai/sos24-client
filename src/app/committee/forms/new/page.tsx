"use client";

import { client } from "@/lib/openapi";
import { getProjectAttributeText, getProjectCategoryText } from "@/lib/textUtils";
import { ProjectAttribute, ProjectCategory, projectAttributes, projectCategories } from "@/lib/valibot";
import { css } from "@styled-system/css";
import { stack, visuallyHidden } from "@styled-system/patterns";
import dayjs from "dayjs";
import { NextPage } from "next";
import { FC } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FormFieldEditor } from "./FormFieldEditor";

const sectionTitleStyle = css({
  fontSize: "xl",
  fontWeight: "bold",
});

const descriptionStyle = css({
  fontSize: "sm",
  color: "gray.600",
});

const checkboxStyle = css({
  py: 1,
  px: 4,
  rounded: "full",
  background: "gray.200",
  color: "gray.500",
  fontSize: "sm",
  fontWeight: "bold",
  "&:has(:checked)": {
    background: "tsukuba.purple",
    color: "white",
  },
});

const checkboxGrpupStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
});

const textInputStyle = css({
  border: "1px solid token(colors.gray.400)",
  background: "gray.100",
  rounded: "sm",
  width: "full",
  padding: 2,
});

const Divider: FC = () => {
  return <div className={css({ width: "full", height: "2px", background: "gray.400" })}></div>;
};

export type FormField = {
  name: string;
  description: string;
  required: boolean;
} & (
  | {
      type: "int";
      min: number;
      max: number;
    }
  | {
      type: "string";
      minLength: number;
      maxLength: number;
      allowNewline: boolean;
    }
  | {
      type: "choose_one";
      options: string[];
    }
  | {
      type: "choose_many";
      minSelection: number;
      maxSelection: number;
      options: string[];
    }
  | {
      type: "file";
      extensions: string[];
      limit: number;
    }
);

type CreateFormInput = {
  starts_at: string;
  ends_at: string;
  title: string;
  description: string;
  categories: ProjectCategory[];
  attributes: ProjectAttribute[];
  attachments: string[];
  items: FormField[];
};

const CreateFormPage: NextPage = () => {
  const { register, control, handleSubmit } = useForm<CreateFormInput>({
    defaultValues: {
      categories: [],
      attributes: [],
      attachments: [],
    },
  });
  const { fields, append } = useFieldArray({ name: "items", control });

  const onSubmit = handleSubmit((data) => {
    const body = {
      ...data,
      attributes: data.attributes.length === 0 ? [...projectAttributes] : data.attributes,
      categories: data.categories.length === 0 ? [...projectCategories] : data.categories,
      starts_at: data.starts_at === "" ? dayjs().toISOString() : data.starts_at,
      ends_at: dayjs(data.ends_at).toISOString(),
    };

    client.POST("/forms", {
      body,
    });
  });

  return (
    <div
      className={stack({
        maxWidth: "2xl",
        marginInline: "auto",
        padding: 5,
        gap: 4,
      })}>
      <h1
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
        })}>
        新規申請作成
      </h1>
      <Divider />
      <form className={stack({ gap: 4 })}>
        <fieldset
          className={stack({
            gap: 5,
          })}>
          <legend className={sectionTitleStyle}>送信先絞り込み</legend>
          <p className={descriptionStyle}>選択しない場合全ての企画が対象になります</p>

          <div className={stack({ gap: 2 })}>
            <label>企画区分</label>
            <div className={checkboxGrpupStyle}>
              {projectCategories.map((category) => (
                <Controller
                  key={category}
                  name="categories"
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <label className={checkboxStyle}>
                      <input
                        type="checkbox"
                        value={category}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          const newValue = checked ? [...value, category] : value.filter((v) => v !== category);
                          onChange(newValue);
                        }}
                        onBlur={onBlur}
                        checked={value.includes(category)}
                        ref={ref}
                        className={visuallyHidden()}
                      />
                      {getProjectCategoryText(category)}
                    </label>
                  )}
                />
              ))}
            </div>
          </div>

          <div className={stack({ gap: 2 })}>
            <label>企画属性</label>
            <div className={checkboxGrpupStyle}>
              {projectAttributes.map((attribute) => (
                <Controller
                  key={attribute}
                  name="attributes"
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <label className={checkboxStyle}>
                      <input
                        type="checkbox"
                        value={attribute}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          const newValue = checked ? [...value, attribute] : value.filter((v) => v !== attribute);
                          onChange(newValue);
                        }}
                        onBlur={onBlur}
                        checked={value.includes(attribute)}
                        ref={ref}
                        className={visuallyHidden()}
                      />
                      {getProjectAttributeText(attribute)}
                    </label>
                  )}
                />
              ))}
            </div>
          </div>
        </fieldset>

        <Divider />

        <div className={stack({ gap: 4 })}>
          <div>
            <label htmlFor="title">タイトル</label>
            <input {...register("title", { required: true })} className={textInputStyle} />
          </div>
          <div>
            <label htmlFor="description">説明</label>
            <textarea {...register("description", { required: true })} className={textInputStyle} />
          </div>
          <div>
            <label htmlFor="attachments">添付ファイル</label>
          </div>
          <div>
            <p className={descriptionStyle}>受付開始日時を選択しなかった場合現在時刻が入力されます</p>
            <div>
              <label>受付開始日時</label>
              <input type="datetime-local" {...register("starts_at")} />
            </div>
            <div>
              <label>受付終了日時</label>
              <input type="datetime-local" {...register("ends_at", { required: true })} />
            </div>
          </div>
        </div>

        <Divider />

        <fieldset>
          <legend>質問項目</legend>
          <div>
            <button
              type="button"
              onClick={() => {
                append({
                  name: "",
                  description: "",
                  required: false,
                  type: "string",
                  minLength: 0,
                  maxLength: 0,
                  allowNewline: false,
                });
              }}>
              テキスト項目
            </button>
            <button>チェックボックス項目</button>
            <button>ドロップダウン項目</button>
            <button>ファイル項目</button>
          </div>
        </fieldset>

        <div>
          {fields.map((field, index) => {
            return <FormFieldEditor key={index} field={field} />;
          })}
        </div>

        <button onClick={onSubmit}>送信</button>
      </form>
    </div>
  );
};

export default CreateFormPage;
