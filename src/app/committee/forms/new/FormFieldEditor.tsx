import { FC } from "react";
import { CreateFormInput, type FormField } from "./page";
import { UseFormRegister } from "react-hook-form";

export const FormFieldEditor: FC<{ field: FormField; index: number; register: UseFormRegister<CreateFormInput> }> = ({
  field,
  index,
  register,
}) => {
  switch (field.type) {
    case "string":
      return (
        <div>
          <p>テキスト項目</p>
          <label>
            <input type="checkbox" {...register(`items.${index}.required`)} />
            必須
          </label>
          <label>
            <input type="checkbox" {...register(`items.${index}.allow_newline`)} />
            複数行での回答
          </label>

          <label>質問</label>
          <input {...register(`items.${index}.name`, { required: true })} />

          <label>説明(任意)</label>
          <input {...register(`items.${index}.description`)} />

          <label>最小文字数</label>
          <input type="number" {...register(`items.${index}.min_length`, { valueAsNumber: true })} />

          <label>最大文字数</label>
          <input type="number" {...register(`items.${index}.max_length`, { valueAsNumber: true })} />
        </div>
      );
    case "int":
      return <></>;
    case "choose_one":
      return <></>;
    case "choose_many":
      return <></>;
  }
};
