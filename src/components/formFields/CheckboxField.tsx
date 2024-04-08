import { FC } from "react";
import { RequiredBadge } from "./_components/RequiredBadge";
import { css } from "@styled-system/css";
import { basicFieldProps } from "./_components/types";
import { basicFormLabelStyle, checkboxFormStyle } from "./styles";

interface Props extends basicFieldProps {
  options: string[];
}

export const CheckboxForm: FC<Props> = (props: Props) => {
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
                  name={option}
                  id={`${props.id}-${index}`}
                  className={checkboxFormStyle}
                />
                <label
                  htmlFor={`${props.id}-${index}`}
                  className={css({
                    paddingInline: 2,
                    width: "100%",
                    fontSize: 18,
                    cursor: "pointer",
                  })}>
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
