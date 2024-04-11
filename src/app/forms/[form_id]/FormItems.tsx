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

type Props = {
  items: FormItem[] | undefined;
  register: UseFormRegister<{ [x: string]: valueof<FormFieldsTypeMap> }>;
  errors: FieldErrors<{ [x: string]: valueof<FormFieldsTypeMap> }>;
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
            register={register(item.id)}
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
            register={register(item.id)}
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
            register={register(item.id)}
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
