import { FC } from "react";
import { RequiredBadge } from "./RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormStyle } from "./styles";

interface Props {
  id: number | string;
  name: string;
  description: string;
  required: boolean;
  min: number | null;
  max: number | null;
}

export const NumberForm: FC<Props> = (props: Props) => {
  return (
    <>
      <label
        className={css({
          marginBlock: 2,
          fontSize: "lg",
          fontWeight: "bold",
          display: "block",
        })}
        htmlFor={`formitem-${props.id}`}>
        {props.name}
        <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
      </label>
      <input
        type="number"
        name={`formitem-${props.id}`}
        min={props.min ?? undefined}
        max={props.max ?? undefined}
        required={props.required}
        className={cx(basicFormStyle, css({ height: 9, width: 24 }))}
      />
    </>
  );
};
