import { basicFieldProps } from "@/components/formFields/_components/types";
import { basicErrorMessageStyle, checkboxFormStyle } from "@/components/formFields/styles";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";

interface SingleCheckboxFieldProps extends basicFieldProps {}

export const SingleCheckboxField = ({ id, label, register, error }: SingleCheckboxFieldProps) => {
  return (
    <div>
      <div
        className={flex({
          alignItems: "center",
        })}>
        <input type="checkbox" id={id} {...register} className={checkboxFormStyle} />
        <label
          htmlFor={id}
          className={css({
            paddingInline: 2,
            fontSize: "sm",
            cursor: "pointer",
          })}>
          {label}
        </label>
      </div>
      {error && <span className={basicErrorMessageStyle}>{error}</span>}
    </div>
  );
};
