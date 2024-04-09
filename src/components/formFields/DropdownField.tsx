import { FC } from "react";
import { RequiredBadge } from "./_components/RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormLabelStyle, basicFormStyle, dropdownStyle } from "./styles";
import { basicFieldProps } from "./_components/types";

interface Props extends basicFieldProps {
  options: string[];
}

export const DropdownForm: FC<Props> = (props: Props) => {
  return (
    <div>
      <label className={basicFormLabelStyle} htmlFor={props.id}>
        {props.label}
        {props.required !== undefined && <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />}
      </label>
      <select id={props.id} name={props.id} className={cx(basicFormStyle(), dropdownStyle)}>
        <option value="" hidden></option>
        {props.options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};