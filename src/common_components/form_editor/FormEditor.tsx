"use client";

import { css } from "@styled-system/css";
import { FC, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ProjectAttribute, ProjectCategory, projectAttributes, projectCategories } from "@/lib/valibot";
import { getProjectCategoryText, getProjectAttributeText } from "@/lib/textUtils";
import { stack, visuallyHidden } from "@styled-system/patterns";
import { FormFieldEditor } from "./FormFieldEditor";
import { sectionTitleStyle, descriptionStyle, checkboxGrpupStyle, checkboxStyle, textInputStyle } from "./styles";
import { components } from "@/schema";
import dayjs from "dayjs";
import { deleteAllUploadedFiles, postFiles } from "@/lib/postFile";
import toast from "react-hot-toast";
import { FilesFormType, FileErrorsType } from "@/app/forms/[form_id]/FormItems";
import { FilesField } from "@/common_components/formFields/Files";
import { Button, buttonStyle } from "@/recipes/button";

export type FormField = {
  name: string;
  description?: string;
  required: boolean;
} & (
  | {
      type: "int";
      min?: number;
      max?: number;
    }
  | {
      type: "string";
      min_length?: number;
      max_length?: number;
      allow_newline?: boolean;
    }
  | {
      type: "choose_one";
      options: string;
    }
  | {
      type: "choose_many";
      min_selection?: number;
      max_selection?: number;
      options: string;
    }
  | {
      type: "file";
      extensions: string;
      limit: number;
    }
);

type ExtractFormFieldType<T> = T extends { type: infer U } ? U : never;
export type FormFieldType = ExtractFormFieldType<FormField>;

export type CreateFormInput = {
  starts_at: string;
  ends_at: string;
  title: string;
  description: string;
  categories: ProjectCategory[];
  attributes: ProjectAttribute[];
  attachments: string[];
  items: FormField[];
};

const Divider: FC = () => {
  return <div className={css({ width: "full", height: "2px", background: "gray.400" })}></div>;
};

export type HandleFormEditorSubmit = (
  _: components["schemas"]["CreateForm"] | components["schemas"]["UpdateForm"],
) => void;

export const FormEditor: FC<{
  defaultValues?: CreateFormInput;
  onSubmit: HandleFormEditorSubmit;
}> = ({ onSubmit, defaultValues }) => {
  const { register, control, handleSubmit } = useForm<CreateFormInput>({
    defaultValues: defaultValues ?? {
      categories: [],
      attributes: [],
      attachments: [],
    },
  });
  const { fields, append, remove, move } = useFieldArray({ name: "items", control });

  const [files, setFiles] = useState<FilesFormType>(new Map([["attachments", null]]));
  const [fileErrors, setFileErrors] = useState<FileErrorsType>(new Map([["attachments", null]]));

  return (
    <>
      <Divider />
      <form
        className={stack({ gap: 4 })}
        onSubmit={handleSubmit(async (data) => {
          if (fileErrors.get("attachments")) {
            toast.error("正しいファイルをアップロードしてください");
            return;
          }

          const fileIds = await postFiles("public", files);
          if (!fileIds) {
            toast.error("ファイルのアップロードに失敗しました");
            return;
          }

          const body = {
            ...data,
            attributes: data.attributes.length === 0 ? [...projectAttributes] : data.attributes,
            categories: data.categories.length === 0 ? [...projectCategories] : data.categories,
            starts_at: (data.starts_at === "" ? dayjs() : dayjs(data.starts_at)).toISOString(),
            ends_at: dayjs(data.ends_at).toISOString(),
            attachments: fileIds.attachments ?? [],
            items: [
              ...data.items.map((item) => {
                if (item.type === "choose_many" || item.type === "choose_one") {
                  return {
                    ...item,
                    options: item.options.split("\n"),
                  };
                }

                if (item.type === "file") {
                  return {
                    ...item,
                    extensions: item.extensions.split("\n"),
                  };
                }

                return item;
              }),
            ],
          };

          onSubmit(body);

          deleteAllUploadedFiles(fileIds);
        })}>
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
            <FilesField
              id="attachments"
              label="添付ファイル"
              register={register("attachments")}
              setFiles={setFiles}
              setErrorState={setFileErrors}
            />
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
          <div
            className={css({
              width: "full",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "& > button": {
                flexGrow: 1,
              },
            })}>
            <button
              className={buttonStyle({
                shadow: "md",
                color: "blue",
                visual: "outline",
                size: "y",
              })}
              type="button"
              onClick={() => {
                append({
                  name: "",
                  required: false,
                  type: "string",
                });
              }}>
              テキスト項目
            </button>
            <button
              className={buttonStyle({
                shadow: "md",
                color: "blue",
                visual: "outline",
                size: "y",
              })}
              type="button"
              onClick={() => {
                append({
                  name: "",
                  required: false,
                  type: "int",
                });
              }}>
              数値項目
            </button>
            <button
              className={buttonStyle({
                shadow: "md",
                color: "blue",
                visual: "outline",
                size: "y",
              })}
              type="button"
              onClick={() => {
                append({
                  name: "",
                  type: "choose_many",
                  required: false,
                  options: "",
                });
              }}>
              チェックボックス項目
            </button>
            <button
              className={buttonStyle({
                shadow: "md",
                color: "blue",
                visual: "outline",
                size: "y",
              })}
              type="button"
              onClick={() => {
                append({
                  name: "",
                  type: "choose_one",
                  required: false,
                  options: "",
                });
              }}>
              ドロップダウン項目
            </button>
            <button
              className={buttonStyle({
                shadow: "md",
                color: "blue",
                visual: "outline",
                size: "y",
              })}
              type="button"
              onClick={() => {
                append({
                  name: "",
                  type: "file",
                  required: false,
                  extensions: "",
                  limit: 0,
                });
              }}>
              ファイル項目
            </button>
          </div>
        </fieldset>

        <div
          className={stack({
            gap: 4,
          })}>
          {fields.map((field, index) => {
            return (
              <FormFieldEditor
                key={index}
                field={field}
                index={index}
                register={register}
                move={move}
                remove={() => {
                  remove(index);
                }}
              />
            );
          })}
        </div>

        <Button
          visual="solid"
          color="purple"
          className={css({
            alignSelf: "center",
          })}>
          送信
        </Button>
      </form>
    </>
  );
};
