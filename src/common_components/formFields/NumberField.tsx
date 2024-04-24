import { css, cx } from "@styled-system/css";
import { basicDescriptionStyle, basicErrorMessageStyle, basicFormLabelStyle, basicFormStyle } from "./styles";

import { RequiredBadge } from "./_components/RequiredBadge";
import type { basicFieldProps } from "./_components/types";

interface NumberFieldProps extends basicFieldProps {
  placeholder?: string;
}

export const NumberField = ({ id, label, placeholder, description, required, error, register }: NumberFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className={basicFormLabelStyle}>
        {label}
        {required !== undefined && <RequiredBadge isRequired={required} className={css({ marginInline: 2 })} />}
      </label>
      <p className={basicDescriptionStyle}>{description}</p>
      <div className={css({ width: "90%" })}>
        <input
          type="number"
          id={id}
          placeholder={placeholder}
          {...register}
          className={cx(basicFormStyle({ isInvalid: !!error }), css({ height: 9, width: 24 }))}
        />

        <div className={css({ marginLeft: 3 })}>{error && <span className={basicErrorMessageStyle}>{error}</span>}</div>
      </div>
    </div>
  );
};
