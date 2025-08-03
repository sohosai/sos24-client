import { FC } from "react";
import { UseFormRegister, FieldError, UseFormWatch } from "react-hook-form";
import {
  checkboxFormStyle,
  basicErrorMessageStyle,
  basicHintMessageStyle,
} from "@/common_components/formFields/styles";
import { css } from "@styled-system/css";
import { textInputStyle } from "./styles";
import { hstack, stack } from "@styled-system/patterns";

import PulldownMenu from "@/assets/pulldownMenu.svg";
import TrashOutline from "@/assets/TrashOutline.svg";
import { FormFieldType, FormField, CreateFormInput } from "./FormEditor";
import { hasRegexSpecialCharacters } from "@/lib/textUtils";

const getFieldTypeText = (type: FormFieldType): string => {
  switch (type) {
    case "string":
      return "テキスト";
    case "int":
      return "数値";
    case "choose_one":
      return "ドロップダウン";
    case "choose_many":
      return "チェックボックス";
    case "file":
      return "ファイル";
    default:
      return "unreachable";
  }
};

export const FormFieldEditor: FC<{
  field: FormField;
  index: number;
  register: UseFormRegister<CreateFormInput>;
  watch: UseFormWatch<CreateFormInput>;
  errors?: {
    name?: FieldError;
    description?: FieldError;
    options?: FieldError;
    limit?: FieldError;
    extensions?: FieldError;
    min?: FieldError;
    max?: FieldError;
    min_length?: FieldError;
    max_length?: FieldError;
    min_selection?: FieldError;
    max_selection?: FieldError;
  };
  remove: () => void;
  moveDown?: () => void;
  moveUp?: () => void;
  disabled?: boolean;
}> = ({ field, index, register, watch, errors, remove, moveDown, moveUp, disabled = false }) => {
  const disabled_prop: true | undefined = disabled !== false ? undefined : true;

  const limitValue = watch(`items.${index}.limit`);

  // ファイル拡張子の特殊文字チェック
  const extensionsValue = watch(`items.${index}.extensions`);
  const extensionsList = extensionsValue ? extensionsValue.split("\n").filter((ext) => ext.trim()) : [];
  const hasSpecialChars = extensionsList.some((ext) => hasRegexSpecialCharacters(ext.trim()));

  return (
    <div
      className={stack({
        border: "1px solid token(colors.gray.400)",
        rounded: "md",
        padding: 5,
        display: "grid",
        gap: 2,
      })}>
      {!disabled_prop && moveUp && (
        <button
          type="button"
          onClick={moveUp}
          className={css({
            justifySelf: "center",
          })}
          aria-label="上">
          <PulldownMenu
            className={css({
              rotate: "180deg",
              color: "sohosai.blue",
            })}
          />
        </button>
      )}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        })}>
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: 3,
          })}>
          <p
            className={css({
              color: "sohosai.blue",
              fontWeight: "bold",
            })}>
            {getFieldTypeText(field.type)}項目
          </p>

          <div className={hstack({ gap: 3 })}>
            <label
              className={css({
                display: "inline-flex",
                alignItems: "center",
              })}>
              <input
                type="checkbox"
                {...register(`items.${index}.required`)}
                className={checkboxFormStyle}
                disabled={disabled_prop}
              />
              必須
            </label>

            {field.type === "string" && (
              <label
                className={css({
                  display: "inline-flex",
                  alignItems: "center",
                })}>
                <input
                  type="checkbox"
                  {...register(`items.${index}.allow_newline`)}
                  className={checkboxFormStyle}
                  disabled={disabled_prop}
                />
                複数行での回答
              </label>
            )}
          </div>
        </div>

        {disabled_prop !== true && (
          <button type="button" onClick={remove} aria-label="削除">
            <TrashOutline
              className={css({
                color: "sohosai.blue",
              })}
            />
          </button>
        )}
      </div>

      <div>
        <label htmlFor={`items.${index}.name`}>質問</label>
        <input
          {...register(`items.${index}.name`, { required: { value: true, message: "質問を入力してください" } })}
          className={textInputStyle}
          disabled={disabled_prop}
        />
        <div className={css({ marginBlock: 1 })}>
          {errors?.name && <span className={basicErrorMessageStyle}>{errors.name.message}</span>}
        </div>
      </div>

      <div>
        <label htmlFor={`items.${index}.description`}>説明(任意)</label>
        <textarea {...register(`items.${index}.description`)} className={textInputStyle} disabled={disabled_prop} />
      </div>

      {(() => {
        switch (field.type) {
          case "string":
            return (
              <>
                <div className={hstack({ gap: 3 })}>
                  <div>
                    <label htmlFor={`items.${index}.min_length`}>最小文字数</label>
                    <input
                      type="number"
                      {...register(`items.${index}.min_length`, { valueAsNumber: true })}
                      className={textInputStyle}
                      disabled={disabled_prop}
                    />
                  </div>

                  <div>
                    <label htmlFor={`items.${index}.max_length`}>最大文字数</label>
                    <input
                      type="number"
                      {...register(`items.${index}.max_length`, { valueAsNumber: true })}
                      className={textInputStyle}
                      disabled={disabled_prop}
                    />
                  </div>
                </div>
              </>
            );
          case "int":
            return (
              <>
                <div className={hstack({ gap: 3 })}>
                  <div>
                    <label htmlFor={`items.${index}.min`}>最小値</label>
                    <input
                      type="number"
                      {...register(`items.${index}.min`, { valueAsNumber: true })}
                      className={textInputStyle}
                      disabled={disabled_prop}
                    />
                  </div>

                  <div>
                    <label htmlFor={`items.${index}.max`}>最大値</label>
                    <input
                      type="number"
                      {...register(`items.${index}.max`, { valueAsNumber: true })}
                      className={textInputStyle}
                      disabled={disabled_prop}
                    />
                  </div>
                </div>
              </>
            );
          case "choose_one":
            return (
              <>
                <div>
                  <label htmlFor={`items.${index}.options`}>選択肢(改行区切り)</label>
                  <textarea
                    {...register(`items.${index}.options`, {
                      required: { value: true, message: "選択肢を入力してください" },
                    })}
                    className={textInputStyle}
                    disabled={disabled_prop}
                  />
                  <div className={css({ marginBlock: 1 })}>
                    {errors?.options && <span className={basicErrorMessageStyle}>{errors.options.message}</span>}
                  </div>
                </div>
              </>
            );
          case "choose_many":
            return (
              <>
                <div>
                  <label htmlFor={`items.${index}.options`}>選択肢(改行区切り)</label>
                  <textarea
                    {...register(`items.${index}.options`, {
                      required: { value: true, message: "選択肢を入力してください" },
                    })}
                    className={textInputStyle}
                    disabled={disabled_prop}
                  />
                  <div className={css({ marginBlock: 1 })}>
                    {errors?.options && <span className={basicErrorMessageStyle}>{errors.options.message}</span>}
                  </div>
                </div>

                <div className={hstack({ gap: 3 })}>
                  <div>
                    <label htmlFor={`items.${index}.min_selection`}>最小選択数</label>
                    <input
                      type="number"
                      {...register(`items.${index}.min_selection`, { valueAsNumber: true })}
                      className={textInputStyle}
                      disabled={disabled_prop}
                    />
                  </div>

                  <div>
                    <label htmlFor={`items.${index}.max_selection`}>最大選択数</label>
                    <input
                      type="number"
                      {...register(`items.${index}.max_selection`, { valueAsNumber: true })}
                      className={textInputStyle}
                      disabled={disabled_prop}
                    />
                  </div>
                </div>
              </>
            );
          case "file":
            return (
              <>
                <div>
                  <label htmlFor={`items.${index}.limit`}>ファイル数上限</label>
                  <input
                    type="number"
                    {...register(`items.${index}.limit`, {
                      required: { value: true, message: "ファイル数上限を入力してください" },
                      valueAsNumber: true,
                    })}
                    className={textInputStyle}
                    disabled={disabled_prop}
                  />
                  <div className={css({ marginBlock: 1 })}>
                    {errors?.limit && <span className={basicErrorMessageStyle}>{errors.limit.message}</span>}
                    {limitValue === 0 && (
                      <span className={basicHintMessageStyle}>
                        ファイル数上限が0に設定されているため、ユーザーはファイルをアップロードできません。意図した設定かどうかお確かめください。
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor={`items.${index}.extensions`}>拡張子(改行区切り)</label>
                  <textarea
                    {...register(`items.${index}.extensions`, {
                      required: { value: true, message: "拡張子を入力してください" },
                    })}
                    className={textInputStyle}
                    disabled={disabled_prop}
                  />
                  <div className={css({ marginBlock: 1 })}>
                    {errors?.extensions && <span className={basicErrorMessageStyle}>{errors.extensions.message}</span>}
                    {hasSpecialChars && (
                      <span className={basicHintMessageStyle}>
                        正規表現の特殊文字が含まれています。よくわからない場合は使用しないでください。
                      </span>
                    )}
                  </div>
                </div>
              </>
            );
        }
      })()}

      {disabled_prop !== true && moveDown && (
        <button
          type="button"
          onClick={moveDown}
          className={css({
            justifySelf: "center",
          })}
          aria-label="下">
          <PulldownMenu
            className={css({
              color: "sohosai.blue",
            })}
          />
        </button>
      )}
    </div>
  );
};
