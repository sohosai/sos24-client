import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { css } from "@styled-system/css";
import { basicErrorMessageStyle } from "@/components/forms/styles";

export const BodyField: FC<{
  register: UseFormRegisterReturn;
  error?: string;
}> = ({ register, error }) => {
  return (
    <div>
      <textarea
        id="body"
        placeholder="本文を入力"
        {...register}
        className={css({
          width: "full",
          height: "60dvh",
          backgroundColor: "gray.100",
          padding: 4,
          borderRadius: 5,
          fontSize: "sm",
        })}
      />
      {error && <span className={basicErrorMessageStyle}>{error}</span>}
    </div>
  );
};
