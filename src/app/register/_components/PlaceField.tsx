import { css } from "@styled-system/css";
import { UseFormRegisterReturn } from "react-hook-form";
import { basicErrorMessageStyle, basicFormLabelStyle } from "@/common_components/formFields/styles";
import { center, flex, hstack, stack, visuallyHidden } from "@styled-system/patterns";
import { ProjectPlace } from "@/lib/valibot";
import { ReactElement } from "react";
import Outside from "@/assets/Outside.svg";
import Inside from "@/assets/Inside.svg";
import Stage from "@/assets/Stage.svg";

export type CategoryType = "general" | "stage" | "none";

export const category_to_type = (category?: string): CategoryType => {
  switch (category) {
    case "general":
    case "foods_with_kitchen":
    case "foods_without_kitchen":
    case "foods_without_cooking":
      return "general";
    case "stage_1a":
    case "stage_united":
    case "stage_university_hall":
      return "stage";
    default:
      return "none";
  }
};

interface PlaceFieldProps {
  categoryType: CategoryType;
  register: UseFormRegisterReturn;
  error?: string;
}

export const PlaceField = ({ categoryType, register, error }: PlaceFieldProps) => {
  return (
    <fieldset
      className={stack({
        gap: 1,
      })}>
      <legend className={basicFormLabelStyle}>企画実施場所</legend>
      <div
        className={flex({
          justifyContent: "space-around",
          gap: 4,
          direction: { base: "column", md: "row" },
        })}>
        <PlaceFieldItem
          value="outside"
          label="屋外"
          caption="調理：◎ 火気の使用：◎ 雨天時：△"
          register={register}
          disabled={categoryType === "stage"}
          icon={<Outside width={40} height={40} />}
        />
        <PlaceFieldItem
          value="inside"
          label="屋内"
          caption="調理：◯ 火気の使用：× 雨天時：◎"
          register={register}
          disabled={categoryType === "stage"}
          icon={<Inside width={40} height={40} />}
        />
        <PlaceFieldItem
          value="stage"
          label="ステージ"
          register={register}
          disabled={categoryType === "general"}
          icon={<Stage width={40} height={40} />}
        />
      </div>
      {error && <span className={basicErrorMessageStyle}>{error}</span>}
    </fieldset>
  );
};

interface PlaceFieldItemProps {
  label: string;
  value: ProjectPlace;
  caption?: string;
  register: UseFormRegisterReturn;
  disabled: boolean;
  icon: ReactElement;
}

const PlaceFieldItem = ({ label, value, caption, register, disabled, icon }: PlaceFieldItemProps) => {
  return (
    <div
      key={value}
      className={stack({
        flex: 1,
        gap: 2,
        md: {
          alignItems: "center",
        },
      })}>
      <label
        className={hstack({
          width: "full",
          gap: 4,
          borderWidth: 3,
          borderStyle: "solid",
          borderRadius: 9,
          paddingX: 4,
          paddingY: 4,

          cursor: "pointer",
          borderColor: "gray.400",
          transition: "all 0.2s",
          "&:hover": {
            background: "gray.200",
          },
          "&:has(> input:checked)": {
            borderColor: "tsukuba.purple",
          },
          "&:has(> input:disabled)": {
            backgroundColor: "gray.300",
            cursor: "not-allowed",
            "& img": {
              filter: "opacity(0.3)",
            },
            "& span": {
              opacity: 0.5,
            },
          },
        })}>
        <input type="radio" value={value} {...register} disabled={disabled} className={visuallyHidden()} />
        <div className={center({ width: 14, background: "tsukuba.purple", borderRadius: "full", padding: 2 })}>
          {icon}
        </div>
        <span
          className={css({
            fontSize: "md",
            fontWeight: "bold",
          })}>
          {label}
        </span>
      </label>
      <pre
        className={css({
          color: "gray.400",
          fontSize: "min(0.875rem, 4.2vw)",
          fontWeight: "bold",
        })}>
        {caption}
      </pre>
    </div>
  );
};
