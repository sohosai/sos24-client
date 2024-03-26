import { FC } from "react";
import { RequiredBadge } from "./RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormStyle } from "./styles";

interface Props {
  id: number | string;
  name: string;
  description: string;
  required: boolean;
  minLength: number | null;
  maxLength: number | null;
  allowNewline: boolean | null;
}

export const StringForm: FC<Props> = (props: Props) => {
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
      {props.allowNewline ? (
        <textarea name={`formitem-${props.id}`} rows={5} className={basicFormStyle}></textarea>
      ) : (
        <input
          type="text"
          name={`formitem-${props.id}`}
          minLength={props.minLength ?? undefined}
          maxLength={props.maxLength ?? undefined}
          required={props.required}
          className={cx(basicFormStyle, css({ height: 9 }))}
        />
      )}
    </>
  );
};
