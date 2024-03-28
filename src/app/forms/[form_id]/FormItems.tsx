import { FC } from "react";

import { StringForm } from "@/components/forms/String";
import { NumberForm } from "@/components/forms/Number";
import { DropdownForm } from "@/components/forms/Dropdown";
import { CheckboxForm } from "@/components/forms/Checkbox";

import { components } from "@/schema";
import { FilesForm } from "@/components/forms/Files";

type FormItem = components["schemas"]["FormItem"];

export const FormItems: FC<{
  items: FormItem[] | undefined;
}> = ({ items }) => {
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
          <NumberForm
            id={item.id ?? ""}
            name={item.name ?? ""}
            description={item.name ?? ""}
            required={item.required ?? true}
            min={item.min !== undefined ? item.min : null}
            max={item.max !== undefined ? item.max : null}
          />
        );
      case "string":
        return (
          <StringForm
            id={item.id ?? ""}
            name={item.name ?? ""}
            description={item.name ?? ""}
            required={item.required ?? true}
            minLength={item.min !== undefined ? item.min : null}
            maxLength={item.max !== undefined ? item.max : null}
            allowNewline={item.allow_newline ?? false}
          />
        );
      case "choose_one":
        return (
          <DropdownForm
            id={item.id ?? ""}
            name={item.name ?? ""}
            description={item.name ?? ""}
            required={item.required ?? true}
            options={item.options ?? []}
          />
        );
      case "choose_many":
        return (
          <CheckboxForm
            id={item.id ?? ""}
            name={item.name ?? ""}
            description={item.name ?? ""}
            required={item.required ?? true}
            options={item.options ?? []}
          />
        );
      case "file":
        return (
          <FilesForm
            id={item.id ?? ""}
            name={item.name ?? ""}
            description={item.name ?? ""}
            required={item.required ?? true}
            extensions={item.extensions ?? []}
            limit={item.limit ?? null}
          />
        );
      default:
        console.error("項目の読み込みに失敗しました: ", item);
        return <p>項目の読み込みに失敗しました</p>;
    }
  });
};
