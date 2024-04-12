import { FC } from "react";
import { CreateFormInput, type FormField } from "./page";
import { UseFormRegister } from "react-hook-form";
import { checkboxFormStyle } from "@/components/formFields/styles";
import { css } from "@styled-system/css";
import { textInputStyle } from "./styles";

export const FormFieldEditor: FC<{ field: FormField; index: number; register: UseFormRegister<CreateFormInput> }> = ({
  field,
  index,
  register,
}) => {
  return (
    <div
      className={css({
        border: "1px solid token(colors.gray.400)",
        rounded: "md",
        padding: 5,
      })}>
      {(() => {
        switch (field.type) {
          case "string":
            return (
              <>
                <p>テキスト項目</p>
                <label
                  className={css({
                    display: "inline-flex",
                    alignItems: "center",
                  })}>
                  <input type="checkbox" {...register(`items.${index}.required`)} className={checkboxFormStyle} />
                  必須
                </label>
                <label
                  className={css({
                    display: "inline-flex",
                    alignItems: "center",
                  })}>
                  <input type="checkbox" {...register(`items.${index}.allow_newline`)} className={checkboxFormStyle} />
                  複数行での回答
                </label>

                <div>
                  <label>質問</label>
                  <input {...register(`items.${index}.name`, { required: true })} className={textInputStyle} />
                </div>

                <div>
                  <label>説明(任意)</label>
                  <textarea {...register(`items.${index}.description`)} className={textInputStyle} />
                </div>

                <label>最小文字数</label>
                <input
                  type="number"
                  {...register(`items.${index}.min_length`, { valueAsNumber: true })}
                  className={textInputStyle}
                />

                <label>最大文字数</label>
                <input
                  type="number"
                  {...register(`items.${index}.max_length`, { valueAsNumber: true })}
                  className={textInputStyle}
                />
              </>
            );
          case "int":
            return <></>;
          case "choose_one":
            return <></>;
          case "choose_many":
            return <></>;
        }
      })()}
    </div>
  );
};
