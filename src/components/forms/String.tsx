import { FC, useRef, useState } from "react";
import { RequiredBadge } from "./RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicErrorMessageStyle, basicFormLabelStyle, basicFormStyle } from "./styles";
import { basicFormProps } from "./types";

interface Props extends basicFormProps {
  minLength: number | null;
  maxLength: number | null;
  allowNewline: boolean | null;
}

export const StringForm: FC<Props> = (props: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className={basicFormLabelStyle} htmlFor={props.id}>
        {props.name}
        <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
      </label>
      {props.allowNewline ? (
        <textarea id={props.id} name={props.id} rows={5} className={basicFormStyle()}></textarea>
      ) : (
        <>
          <input
            type="text"
            id={props.id}
            name={props.id}
            minLength={props.minLength ?? undefined}
            maxLength={props.maxLength ?? undefined}
            required={props.required}
            ref={ref}
            onBlur={(e) => {
              e.preventDefault();
              const isValid = ref.current?.checkValidity();
              if (!isValid) {
                setErrorMessage(ref.current?.validationMessage ?? "");
              } else {
                setErrorMessage(null);
              }
            }}
            className={cx(basicFormStyle({ isInvalid: errorMessage ? true : false }), css({ height: 9 }))}
          />
          <span className={basicErrorMessageStyle}>{errorMessage}</span>
        </>
      )}
    </div>
  );
};
