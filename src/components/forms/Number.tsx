import { FC } from "react";
import { RequiredBadge } from "./RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormLabelStyle, basicFormStyle } from "./styles";
import { basicFormProps } from "./types";

interface Props extends basicFormProps {
  min: number | null;
  max: number | null;
}

export const NumberForm: FC<Props> = (props: Props) => {
  return (
    <>
      <label className={basicFormLabelStyle} htmlFor={props.id}>
        {props.name}
        <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
      </label>
      <input
        type="number"
        id={props.id}
        name={props.id}
        min={props.min ?? undefined}
        max={props.max ?? undefined}
        required={props.required}
        className={cx(basicFormStyle, css({ height: 9, width: 24 }))}
      />
    </>
  );
};
