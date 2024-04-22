import { FC } from "react";
import { RequiredBadge } from "./_components/RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormLabelStyle, basicFormStyle, dropdownStyle, basicErrorMessageStyle } from "./styles";
import { basicFieldProps } from "./_components/types";

interface Props extends basicFieldProps {
  options: string[];
}

export const DropdownField: FC<Props> = (props: Props) => {
  return (
    <div>
      <label className={basicFormLabelStyle} htmlFor={props.id}>
        {props.label}
        {props.required !== undefined && (
          <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
        )}
      </label>
      <p
        className={css({
          fontSize: "sm",
          color: "gray.500",
        })}>
        {props.description}
      </p>
      <select id={props.id} {...props.register} className={cx(basicFormStyle(), dropdownStyle)}>
        <option value="" hidden></option>
        {props.options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
      <div className={css({ sm: { marginInline: 3 }, marginBlock: 1 })}>
        {props.error && <span className={basicErrorMessageStyle}>{props.error}</span>}
      </div>
    </div>
  );
};
