import { UseFormRegisterReturn } from "react-hook-form";
import { basicErrorMessageStyle, checkboxFormStyle } from "@/components/forms/styles";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";

interface CheckboxFieldProps {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export const CheckboxField = ({ id, label, register, error }: CheckboxFieldProps) => {
  return (
    <div>
      <div className={flex({
        alignItems: "center"
      })}>
        <input type="checkbox" id={id} {...register} className={checkboxFormStyle} />
        <label htmlFor={id} className={css({
          paddingInline: 2,
          fontSize: "sm",
          cursor: "pointer"
        })}>{label}</label>
      </div>
      {error && <span className={basicErrorMessageStyle}>{error}</span>}
    </div>
  );
};