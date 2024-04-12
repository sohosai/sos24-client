import { FC } from "react";
import { type FormField } from "./page";

export const FormFieldEditor: FC<{ field: FormField }> = ({ field }) => {
  switch (field.type) {
    case "string":
      return <div></div>;
    case "int":
      return <div></div>;
    case "choose_one":
      return <div></div>;
    case "choose_many":
      return <div></div>;
  }
};
