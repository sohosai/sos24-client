import { FC } from "react";
import { CreateFormInput, FormFieldType, type FormField } from "./page";
import { UseFieldArrayMove, UseFormRegister } from "react-hook-form";
import { checkboxFormStyle } from "@/components/formFields/styles";
import { css } from "@styled-system/css";
import { textInputStyle } from "./styles";
import { hstack, stack } from "@styled-system/patterns";

import pulldownMenu from "@/components/assets/pulldownMenu.svg";
import trashOutline from "@/components/assets/TrashOutline.svg";
import Image from "next/image";

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
    default:
      return "unreachable";
  }
};

export const FormFieldEditor: FC<{
  field: FormField;
  index: number;
  register: UseFormRegister<CreateFormInput>;
  remove: () => void;
  move: UseFieldArrayMove;
}> = ({ field, index, register, remove, move }) => {
  return (
    <div
      className={stack({
        border: "1px solid token(colors.gray.400)",
        rounded: "md",
        padding: 5,
        display: "grid",
        gap: 2,
      })}>
      <button
        type="button"
        onClick={() => {
          move(index, index - 1);
        }}
        className={css({
          justifySelf: "center",
        })}>
        <Image
          src={pulldownMenu}
          alt="上"
          className={css({
            rotate: "180deg",
          })}
        />
      </button>
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
              <input type="checkbox" {...register(`items.${index}.required`)} className={checkboxFormStyle} />
              必須
            </label>

            {field.type === "string" && (
              <label
                className={css({
                  display: "inline-flex",
                  alignItems: "center",
                })}>
                <input type="checkbox" {...register(`items.${index}.allow_newline`)} className={checkboxFormStyle} />
                複数行での回答
              </label>
            )}
          </div>
        </div>

        <button type="button" onClick={remove}>
          <Image src={trashOutline} alt="削除" />
        </button>
      </div>

      <div>
        <label>質問</label>
        <input {...register(`items.${index}.name`, { required: true })} className={textInputStyle} />
      </div>

      <div>
        <label>説明(任意)</label>
        <textarea {...register(`items.${index}.description`)} className={textInputStyle} />
      </div>

      {(() => {
        switch (field.type) {
          case "string":
            return (
              <>
                <div className={hstack({ gap: 3 })}>
                  <div>
                    <label>最小文字数</label>
                    <input
                      type="number"
                      {...register(`items.${index}.min_length`, { valueAsNumber: true })}
                      className={textInputStyle}
                    />
                  </div>

                  <div>
                    <label>最大文字数</label>
                    <input
                      type="number"
                      {...register(`items.${index}.max_length`, { valueAsNumber: true })}
                      className={textInputStyle}
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
                    <label>最小値</label>
                    <input
                      type="number"
                      {...register(`items.${index}.min`, { valueAsNumber: true })}
                      className={textInputStyle}
                    />
                  </div>

                  <div>
                    <label>最大値</label>
                    <input
                      type="number"
                      {...register(`items.${index}.max`, { valueAsNumber: true })}
                      className={textInputStyle}
                    />
                  </div>
                </div>
              </>
            );
          case "choose_one":
            return (
              <>
                <div>
                  <label>選択肢(改行区切り)</label>
                  <textarea {...register(`items.${index}.options`, { required: true })} className={textInputStyle} />
                </div>
              </>
            );
          case "choose_many":
            return (
              <>
                <div>
                  <label>選択肢(改行区切り)</label>
                  <textarea {...register(`items.${index}.options`, { required: true })} className={textInputStyle} />
                </div>

                <div className={hstack({ gap: 3 })}>
                  <div>
                    <label>最小選択数</label>
                    <input
                      type="number"
                      {...register(`items.${index}.min_selection`, { valueAsNumber: true })}
                      className={textInputStyle}
                    />
                  </div>

                  <div>
                    <label>最大選択数</label>
                    <input
                      type="number"
                      {...register(`items.${index}.max_selection`, { valueAsNumber: true })}
                      className={textInputStyle}
                    />
                  </div>
                </div>
              </>
            );
        }
      })()}

      {
        <button
          type="button"
          onClick={() => {
            move(index, index + 1);
          }}
          className={css({
            justifySelf: "center",
          })}>
          <Image src={pulldownMenu} alt="下" />
        </button>
      }
    </div>
  );
};