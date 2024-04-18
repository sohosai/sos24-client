import { Dispatch, FC, SetStateAction } from "react";

import { components } from "@/schema";
import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { NumberField } from "@/common_components/formFields/NumberField";
import { TextField } from "@/common_components/formFields/TextField";
import { DropdownField } from "@/common_components/formFields/DropdownField";
import { CheckboxField } from "@/common_components/formFields/CheckboxField";
import { FilesField } from "@/common_components/formFields/Files";

type FormItem = components["schemas"]["FormItem"];

type valueof<T> = T[keyof T];

type stringArrayJSON = string;
export type FormFieldsTypeMap = {
  string: string;
  int: string;
  choose_one: string;
  choose_many: stringArrayJSON;
  file: "" | null | undefined;
};

export type FormFieldsType = { [x: string]: valueof<FormFieldsTypeMap> };

export type FileErrorsType = Map<string, string | null>;
export type FilesFormType = Map<string, FileList | null>;

type Props = {
  items: FormItem[] | undefined;
  getValues: UseFormGetValues<FormFieldsType>;
  setValue: UseFormSetValue<FormFieldsType>;
  register: UseFormRegister<FormFieldsType>;
  errors: FieldErrors<FormFieldsType>;
  files: FilesFormType;
  setFiles: Dispatch<SetStateAction<FilesFormType>>;
  setFileErrors: Dispatch<SetStateAction<FileErrorsType>>;
};

export const FormItems: FC<Props> = ({
  items,
  getValues,
  setValue,
  register,
  errors,
  files,
  setFiles,
  setFileErrors,
}) => {
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
              required: { value: item.required, message: "数字を入力してください" },
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
              required: { value: item.required, message: "文字を入力してください" },
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
          <DropdownField
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
          <CheckboxField
            id={item.id ?? ""}
            label={item.name ?? ""}
            description={item.description}
            required={item.required ?? true}
            options={item.options ?? []}
            register={register(item.id, {
              validate: (v) => {
                console.log(v);
                const value = v ? JSON.parse(v) : undefined;
                const nums = value ? value.length : undefined;
                console.log(nums);
                if ((!nums || nums === 0) && item.required) {
                  return `選択してください`;
                }
                if (nums && item.min_selection && nums < item.min_selection) {
                  return `最低${item.min_selection}個選択してください`;
                }
                if (nums && item.max_selection && nums < item.max_selection) {
                  return `${item.max_selection}個以下選択してください`;
                }
              },
            })}
            getValues={getValues}
            setValue={setValue}
            error={errors[item.id]?.message}
          />
        );
      case "file":
        return (
          <FilesField
            id={item.id ?? ""}
            label={item.name ?? ""}
            description={item.description}
            required={item.required ?? true}
            extensions={item.extensions ?? []}
            limit={item.limit ?? null}
            register={register(item.id)}
            files={files}
            setFiles={setFiles}
            setErrorState={setFileErrors}
          />
        );
      default:
        return <p>項目の読み込みに失敗しました</p>;
    }
  });
};
