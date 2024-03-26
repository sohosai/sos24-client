import { FC } from "react";
import { RequiredBadge } from "./RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormStyle } from "./styles";
import { basicFormProps } from "./types";

interface Props extends basicFormProps {
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
        htmlFor={props.id}>
        {props.name}
        <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
      </label>
      {props.allowNewline ? (
        <textarea name={props.id} rows={5} className={basicFormStyle}></textarea>
      ) : (
        <input
          type="text"
          name={props.id}
          minLength={props.minLength ?? undefined}
          maxLength={props.maxLength ?? undefined}
          required={props.required}
          className={cx(basicFormStyle, css({ height: 9 }))}
        />
      )}
    </>
  );
};
