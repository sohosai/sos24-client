import { FC } from "react";
import { RequiredBadge } from "./RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormStyle } from "./styles";
import { basicFormProps } from "./types";

interface Props extends basicFormProps {
  options: string[];
}

export const DropdownForm: FC<Props> = (props: Props) => {
  return (
    <>
      <label
        className={css({
          marginBlock: 2,
          fontSize: "lg",
          fontWeight: "bold",
          display: "block",
        })}
        htmlFor={props.id}>
        {props.name}
        <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
      </label>
      <select
      id={props.id}
        name={props.id}
        required={props.required}
        className={cx(
          basicFormStyle,
          css({
            height: 12,
            width: "auto",
            maxWidth: "100%",
            padding: 0,
            paddingLeft: 4,
            paddingRight: 12,
            borderStyle: "none",
            appearance: "none",
            //pulldown.svg
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2360C' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m3 6 4 4M7 10l4-4'/%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "36px",
            backgroundPositionX: "right",
            backgroundPositionY: "10px",
            _hover: { backgroundColor: "gray.200" },
          }),
        )}>
        <option value="" hidden></option>
        {props.options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </>
  );
};
