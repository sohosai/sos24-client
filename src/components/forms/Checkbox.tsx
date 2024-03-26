import { FC } from "react";
import { RequiredBadge } from "./RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormProps } from "./types";
import { basicFormLabelStyle } from "./styles";
import { getApp } from "firebase/app";

interface Props extends basicFormProps {
  options: string[];
}

export const CheckboxForm: FC<Props> = (props: Props) => {
  return (
    <>
      <fieldset>
        <legend className={basicFormLabelStyle}>
          {props.name}
          <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
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
                  className={css({
                    appearance: "none",
                    height: 7,
                    width: 7,
                    border: 3,
                    borderRadius: "sm",
                    borderStyle: "solid",
                    borderColor: "gray.400",
                    cursor: "pointer",

                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' width='18' height='12' viewBox='0 0 18 12'%3e%3cpath stroke='%23A59E9E' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M2 5.7L7.0541 10.5L16 2'/%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPositionX: "center",
                    backgroundPositionY: "center",
                    _checked: {
                      backgroundColor: "primary",
                      borderColor: "primary",
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' width='18' height='12' viewBox='0 0 18 12'%3e%3cpath stroke='%23FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M2 5.7L7.0541 10.5L16 2'/%3e%3c/svg%3e")`,
                    },
                  })}
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
    </>
  );
};
