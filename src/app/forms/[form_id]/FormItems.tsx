import { FC } from "react";

import { components } from "@/schema";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { NumberField } from "@/components/formFields/NumberField";
import { TextField } from "@/components/formFields/TextField";
import { DropdownForm } from "@/components/formFields/DropdownField";
import { CheckboxForm } from "@/components/formFields/CheckboxField";
import { FilesForm } from "@/components/formFields/Files";

type FormItem = components["schemas"]["FormItem"];

type valueof<T> = T[keyof T];

export type FormFieldsTypeMap = {
  string: string;
  int: number;
  choose_one: string;
  choose_many: string[];
  file: FileList;
};

export type formFieldsType = { [x: string]: valueof<FormFieldsTypeMap> };

type Props = {
  items: FormItem[] | undefined;
  register: UseFormRegister<formFieldsType>;
  errors: FieldErrors<formFieldsType>;
};

export const FormItems: FC<Props> = ({ items, register, errors }) => {
  if (!items) {
    return <p>申請項目の読み込みに失敗しました</p>;
  }
  if (items.length == 0) {
    return <p>申請の項目が一件もありません</p>;
  }
  return items.map((item) => {
    switch (item.type) {
      case "int":
        return (
          <NumberField
            id={item.id}
            label={item.name}
            description={item.description}
            required={item.required ?? true}
            register={register(item.id, {
              required: { value: item.required, message: "数字を入力してください。" },
              max: item.max ? { value: item.max, message: `${item.max}以下の数字を入力してください` } : undefined,
              min: item.min ? { value: item.min, message: `${item.min}以上の数字を入力してください` } : undefined,
            })}
            error={errors[item.id]?.message}
          />
        );
      case "string":
        return (
          <TextField
            type={item.allow_newline ? "textarea" : "text"}
            id={item.id}
            label={item.name}
            description={item.description}
            required={item.required ?? true}
            register={register(item.id, {
              required: { value: item.required, message: "文字を入力してください。" },
              maxLength: item.max_length
                ? { value: item.max_length, message: `${item.max_length}文字以下で入力してください` }
                : undefined,
              minLength: item.min_length
                ? { value: item.min_length, message: `${item.min_length}文字以上で入力してください` }
                : undefined,
            })}
            error={errors[item.id]?.message}
          />
        );
      case "choose_one":
        return (
          <DropdownForm
            id={item.id}
            label={item.name}
            description={item.description}
            required={item.required ?? true}
            options={item.options ?? []}
            register={register(item.id, {
              required: { value: item.required, message: "項目を選択してください。" },
            })}
            error={errors[item.id]?.message}
          />
        );
      case "choose_many":
        return (
          <CheckboxForm
            id={item.id ?? ""}
            label={item.name ?? ""}
            description={item.description}
            required={item.required ?? true}
            options={item.options ?? []}
            register={register(item.id)}
            error={errors[item.id]?.message}
          />
        );
      case "file":
        return (
          <FilesForm
            id={item.id ?? ""}
            label={item.name ?? ""}
            description={item.description}
            required={item.required ?? true}
            extensions={item.extensions ?? []}
            limit={item.limit ?? null}
            register={register(item.id)}
            error={errors[item.id]?.message}
          />
        );
      default:
        return <p>項目の読み込みに失敗しました</p>;
    }
  });
};
