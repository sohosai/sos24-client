import { css } from "@styled-system/css";
import { UseFormRegisterReturn } from "react-hook-form";

import categoryIcon from "../../components/assets/CategoryIcon.svg";
import Image from "next/image";
import {
  basicErrorMessageStyle,
  basicFormLabelStyle,
} from "@/_common_components/forms/styles";
import { flex, stack, visuallyHidden } from "@styled-system/patterns";
import React from "react";

interface CategoryItem {
  label: string;
  value: string;
  hasTopSpacer: boolean;
  badges: BadgeProps[];
}

interface CategoryFieldProps {
  items: CategoryItem[];
  register: UseFormRegisterReturn;
  error?: string;
}

export const CategoryField = (
  { items, register, error }: CategoryFieldProps,
) => {
  return (
    <fieldset>
      <legend className={basicFormLabelStyle}>企画区分</legend>
      <div
        className={stack({
          gap: 4,
        })}
      >
        {items.map((item) => (
          <React.Fragment key={item.value}>
            {item.hasTopSpacer && <Separator />}
            <CategoryFieldItem
              label={item.label}
              value={item.value}
              register={register}
              badges={item.badges}
            />
          </React.Fragment>
        ))}
      </div>
      {error && <span className={basicErrorMessageStyle}>{error}</span>}
    </fieldset>
  );
};

interface CategoryFieldItemProps {
  label: string;
  value: string;
  register: UseFormRegisterReturn;
  badges: BadgeProps[];
}

const CategoryFieldItem = (
  { label, value, register, badges }: CategoryFieldItemProps,
) => {
  return (
    <label
      key={value}
      className={flex({
        alignItems: "center",
        gap: 4,
        borderWidth: 3,
        borderColor: "gray.400",
        borderStyle: "solid",
        borderRadius: 9,
        paddingX: 4,
        paddingY: 4,
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          background: "gray.200",
        },
        "&:has(> input:checked)": {
          borderColor: "sohosai.purple",
        },
      })}
    >
      <input
        type="radio"
        value={value}
        {...register}
        className={visuallyHidden()}
      />
      <Image src={categoryIcon} alt={`${label}のアイコン`} />
      <div
        className={css({
          base: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
          },
          sm: {
            display: "contents",
          },
        })}
      >
        <span
          className={css({
            flex: 1,
            fontSize: "md",
            fontWeight: "bold",
          })}
        >
          {label}
        </span>
        <div
          className={flex({
            flex: 1,
            columnGap: 2,
            rowGap: 1,
            flexWrap: "wrap",
          })}
        >
          {badges.map((badge) => (
            <Badge
              key={badge.label}
              label={badge.label}
              allowed={badge.allowed}
            />
          ))}
        </div>
      </div>
    </label>
  );
};

interface BadgeProps {
  label: string;
  allowed: boolean;
}

const Badge = ({ label, allowed }: BadgeProps) => {
  return (
    <span
      className={css({
        backgroundColor: allowed ? "sohosai.blue" : "sohosai.orange",
        color: "white",
        fontSize: { base: "2xs", sm: "xs" },
        fontWeight: "bold",
        borderRadius: 5,
        paddingX: 2,
        paddingY: 1,
        display: "flex",
        flexWrap: "wrap",
        columnGap: 2,
        justifyContent: "center",
      })}
    >
      <span>{label}</span>
      <span>{allowed ? "可" : "不可"}</span>
    </span>
  );
};

// ref: https://stackoverflow.com/questions/69530735/make-a-css-rounded-dotted-line
const Separator = () => {
  return (
    <div
      className={css({
        height: 1,
        background:
          "radial-gradient(circle closest-side, var(--colors-gray-400) 98%,#0000)   50%/10px 100%," +
          "linear-gradient(90deg, var(--colors-gray-400) 50%, #0000 0)              50%/20px 100%;",
      })}
    >
    </div>
  );
};
