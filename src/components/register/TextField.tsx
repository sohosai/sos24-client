import { css } from "@styled-system/css";
import { basicErrorMessageStyle, basicFormLabelStyle, basicFormStyle } from "@/components/forms/styles";
import { UseFormRegisterReturn } from "react-hook-form";
import { center } from "@styled-system/patterns";

interface TextFieldProps {
  type: "text";
  id: string;
  label: string;
  placeholder?: string;
  description?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export const TextField = ({ type, id, label, placeholder, description, error, register }: TextFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className={basicFormLabelStyle}>
        {label}
      </label>
      <div className={center()}>
        <div className={css({ width: { base: "100%", sm: "90%" } })}>
          <input
            type={type}
            id={id}
            placeholder={placeholder}
            {...register}
            className={basicFormStyle({ isInvalid: !!error })}
          />
          <div className={css({ sm: { marginInline: 3 }, marginBlock: 1 })}>
            <p
              className={css({
                fontSize: "sm",
                color: "gray.500",
              })}>
              {description}
            </p>
            {error && <span className={basicErrorMessageStyle}>{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
