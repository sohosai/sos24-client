import { FC, useRef, useState } from "react";
import { RequiredBadge } from "./RequiredBadge";
import { css, cx } from "@styled-system/css";
import { basicFormLabelStyle, basicFormStyle, basicErrorMessageStyle } from "./styles";
import { basicFormProps } from "./types";

interface Props extends basicFormProps {
  min: number | null;
  max: number | null;
}

export const NumberForm: FC<Props> = (props: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
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
        className={cx(basicFormStyle({ isInvarid: errorMessage ? true : false }), css({ height: 9, width: 24 }))}
      />
      <span className={basicErrorMessageStyle}>{errorMessage}</span>
    </div>
  );
};
