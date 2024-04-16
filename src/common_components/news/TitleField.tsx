import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { css } from "@styled-system/css";
import { basicErrorMessageStyle } from "@/common_components/formFields/styles";

export const TitleField: FC<{
  register: UseFormRegisterReturn;
  error?: string;
}> = ({ register, error }) => {
  return (
    <div>
      <input
        type="text"
        id="title"
        placeholder="タイトル"
        {...register}
        className={css({
          width: "full",
          backgroundColor: "gray.100",
          paddingBlock: 2,
          paddingInline: 5,
          borderRadius: 5,
          fontSize: "2xl",
          fontWeight: "bold",
        })}
      />
      {error && <span className={basicErrorMessageStyle}>{error}</span>}
    </div>
  );
};
