import { hstack, visuallyHidden } from "@styled-system/patterns";
import { css, cx } from "@styled-system/css";

import triangleBlackIcon from "@/components/assets/TriangleDownBlack.svg";
import triangleWhiteIcon from "@/components/assets/TriangleDownWhite.svg";
import Image from "next/image";
import { FC } from "react";

export const newsFilters = ["me", "all"] as const;
export type NewsFilterType = (typeof newsFilters)[number];

const filterToLabel = (category: NewsFilterType) => {
  switch (category) {
    case "me":
      return "自分の企画対象のみ";
    case "all":
      return "全体を閲覧";
  }
};

export const FilterSelector: FC<{
  filter: NewsFilterType;
  setFilter: (_selected: NewsFilterType) => void;
}> = ({ filter, setFilter }) => {
  const FilterItem = ({ value }: { value: NewsFilterType }) => {
    const checked = filter === value;
    return (
      <label
        className={hstack({
          paddingX: 3,
          paddingY: 1,
          gap: 1,
          cursor: "pointer",

          backgroundColor: "gray.200",
          "&:has(> input:checked)": {
            backgroundColor: "gray.600",
          },
        })}>
        <input
          type="radio"
          value={value}
          checked={checked}
          onChange={() => setFilter(value)}
          className={cx(visuallyHidden(), "peer")}
        />
        {checked ? <Image src={triangleWhiteIcon} alt="" /> : <Image src={triangleBlackIcon} alt="" />}
        <span
          className={css({
            fontSize: "xs",
            fontWeight: "bold",

            color: "gray.600",
            _peerChecked: {
              color: "white",
            },
          })}>
          {filterToLabel(value)}
        </span>
      </label>
    );
  };

  return (
    <fieldset className={hstack({})}>
      {newsFilters.map((category) => (
        <FilterItem key={category} value={category} />
      ))}
    </fieldset>
  );
};
