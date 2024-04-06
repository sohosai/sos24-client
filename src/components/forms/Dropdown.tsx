import { FC } from "react";
import { RequiredBadge } from "./RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormLabelStyle, basicFormStyle, dropdownStyle } from "./styles";
import { basicFormProps } from "./types";

interface Props extends basicFormProps {
  options: string[];
}

export const DropdownForm: FC<Props> = (props: Props) => {
  return (
    <div>
      <label className={basicFormLabelStyle} htmlFor={props.id}>
        {props.name}
        <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
      </label>
      <select id={props.id} name={props.id} required={props.required} className={cx(basicFormStyle(), dropdownStyle)}>
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
