import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { css } from "@styled-system/css";
import { basicErrorMessageStyle } from "@/common_components/formFields/styles";

export const BodyField: FC<{
  register: UseFormRegisterReturn;
  error?: string;
  value?: string;
}> = ({ register, error, value }) => {
  return (
    <div>
      <textarea
        id="body"
        placeholder="本文を入力"
        {...register}
        onChange={(e) => {
          register.onChange(e);
        }}
        className={css({
          width: "full",
          height: "60dvh",
          backgroundColor: "gray.100",
          padding: 4,
          borderRadius: 5,
          fontSize: "sm",
        })}
        value={value ?? ""}
      />
      {error && <span className={basicErrorMessageStyle}>{error}</span>}
    </div>
  );
};
