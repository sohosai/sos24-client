import { FC } from "react";
import { UseFormGetValues, UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";

import { css, cva } from "@styled-system/css";
import { basicFieldProps } from "./_components/types";
import { basicFormLabelStyle, checkboxFormStyle } from "./styles";
import { RequiredBadge } from "./_components/RequiredBadge";
import { FormFieldsType } from "@/common_components/form_answer/FormItems";

interface Props extends basicFieldProps {
  disabled?: boolean;
  register: UseFormRegisterReturn;
  getValues: UseFormGetValues<FormFieldsType>;
  setValue: UseFormSetValue<FormFieldsType>;
  options: string[];
}

export const CheckboxField: FC<Props> = (props: Props) => {
  return (
    <div>
      <fieldset>
        <legend className={basicFormLabelStyle}>
          {props.label}
          {props.required !== undefined && (
            <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
          )}
        </legend>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
          })}>
          {props.options.map((option, index) => {
            return (
              <div
                key={option}
                className={css({
                  display: "flex",
                  alignItems: "center",
                })}>
                <input
                  type="checkbox"
                  key={option}
                  value={option}
                  id={`${props.id}-${index}`}
                  className={checkboxFormStyle}
                  checked={props.disabled ? JSON.parse(props.getValues(props.id) ?? "[]").includes(option) : undefined}
                  disabled={props.disabled}
                  onChange={(e) => {
                    let checks = JSON.parse(String(props.getValues(props.id) ?? "[]")) as string[];
                    if (checks.includes(option)) {
                      if (!e.target.checked) {
                        checks = checks.filter((v) => v !== option);
                      }
                    } else {
                      checks.push(option);
                    }
                    props.setValue(props.id, JSON.stringify(checks));
                  }}
                />
                <label
                  htmlFor={`${props.id}-${index}`}
                  className={cva({
                    base: {
                      paddingInline: 2,
                      width: "100%",
                      fontSize: 18,
                      cursor: "pointer",
                    },
                    variants: {
                      isDisabled: {
                        true: {
                          cursor: "unset",
                        },
                      },
                    },
                  })({ isDisabled: props.disabled })}>
                  {option}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};
