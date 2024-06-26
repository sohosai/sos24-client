import { css } from "@styled-system/css";
import { UseFormRegisterReturn } from "react-hook-form";

import { basicErrorMessageStyle, basicFormLabelStyle } from "@/common_components/formFields/styles";
import { center, flex, stack, visuallyHidden } from "@styled-system/patterns";
import React, { ReactElement } from "react";
import { Separator } from "@/common_components/Separator";

interface CategoryItem {
  label: string;
  value: string;
  hasTopSpacer: boolean;
  badges: BadgeProps[];
  icon: ReactElement;
}

interface CategoryFieldProps {
  items: CategoryItem[];
  register: UseFormRegisterReturn;
  error?: string;
}

export const CategoryField = ({ items, register, error }: CategoryFieldProps) => {
  return (
    <fieldset>
      <legend className={basicFormLabelStyle}>企画区分</legend>
      <div
        className={stack({
          gap: 4,
        })}>
        {items.map((item) => (
          <React.Fragment key={item.value}>
            {item.hasTopSpacer && <Separator />}
            <CategoryFieldItem
              label={item.label}
              value={item.value}
              register={register}
              badges={item.badges}
              icon={item.icon}
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
  icon: ReactElement;
}

const CategoryFieldItem = ({ label, value, register, badges, icon }: CategoryFieldItemProps) => {
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
          borderColor: "tsukuba.purple",
        },
      })}>
      <input type="radio" value={value} {...register} className={visuallyHidden()} />
      <div className={center({ width: 14, background: "tsukuba.purple", borderRadius: "full", padding: 2 })}>
        {icon}
      </div>
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
        })}>
        <span
          className={css({
            flex: 1,
            fontSize: "md",
            fontWeight: "bold",
          })}>
          {label}
        </span>
        <div
          className={flex({
            flex: 1,
            columnGap: 2,
            rowGap: 1,
            flexWrap: "wrap",
          })}>
          {badges.map((badge) => (
            <Badge key={badge.label} label={badge.label} allowed={badge.allowed} />
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
      })}>
      <span>{label}</span>
      <span>{allowed ? "可" : "不可"}</span>
    </span>
  );
};
