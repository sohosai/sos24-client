import { css } from "@styled-system/css";
import { basicErrorMessageStyle, basicFormLabelStyle, basicFormStyle } from "./styles";

import { RequiredBadge } from "./_components/RequiredBadge";
import type { basicFieldProps } from "./_components/types";

interface TextFieldProps extends basicFieldProps {
  type: "text" | "textarea";
  placeholder?: string;
}

export const TextField = ({ type, id, label, placeholder, description, required, error, register }: TextFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className={basicFormLabelStyle}>
        {label}
        {required !== undefined && <RequiredBadge isRequired={required} className={css({ marginInline: 2 })} />}
      </label>
      <p
        className={css({
          fontSize: "sm",
          color: "gray.500",
        })}>
        {description}
      </p>
      <div className={css({ width: { base: "100%", sm: "90%" } })}>
        {type === "text" ? (
          <input
            type="text"
            id={id}
            placeholder={placeholder}
            {...register}
            className={basicFormStyle({ isInvalid: !!error })}
          />
        ) : (
          type === "textarea" && (
            <textarea
              id={id}
              rows={5}
              placeholder={placeholder}
              {...register}
              className={basicFormStyle({ isInvalid: !!error })}
            />
          )
        )}
        <div className={css({ sm: { marginInline: 3 }, marginBlock: 1 })}>
          {error && <span className={basicErrorMessageStyle}>{error}</span>}
        </div>
      </div>
    </div>
  );
};
