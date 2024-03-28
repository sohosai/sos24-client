import { FC } from "react";
import { RequiredBadge } from "./RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormLabelStyle, basicFormStyle } from "./styles";
import { basicFormProps } from "./types";

interface Props extends basicFormProps {
  minLength: number | null;
  maxLength: number | null;
  allowNewline: boolean | null;
}

export const StringForm: FC<Props> = (props: Props) => {
  return (
    <div>
      <label className={basicFormLabelStyle} htmlFor={props.id}>
        {props.name}
        <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
      </label>
      {props.allowNewline ? (
        <textarea id={props.id} name={props.id} rows={5} className={basicFormStyle}></textarea>
      ) : (
        <input
          type="text"
          id={props.id}
          name={props.id}
          minLength={props.minLength ?? undefined}
          maxLength={props.maxLength ?? undefined}
          required={props.required}
          className={cx(basicFormStyle, css({ height: 9 }))}
        />
      )}
    </div>
  );
};
