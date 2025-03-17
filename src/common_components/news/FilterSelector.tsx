import { hstack, visuallyHidden } from "@styled-system/patterns";
import { css, cx } from "@styled-system/css";

import triangleBlackIcon from "@/assets/TriangleDownBlack.svg?url";
import triangleWhiteIcon from "@/assets/TriangleDownWhite.svg?url";
import Image from "next/image";
import { FC } from "react";

export const newsFiltersMeOrAll = ["me", "all"] as const;
export type NewsFilterMeOrAllType = (typeof newsFiltersMeOrAll)[number];

const filterToLabel = (category: NewsFilterMeOrAllType) => {
  switch (category) {
    case "me":
      return "自分の企画対象のみ";
    case "all":
      return "全体を閲覧";
  }
};

export const filterSelectorStyle = css({
  paddingX: 3,
  paddingY: 1,
  gap: 1,
  cursor: "pointer",
  backgroundColor: "gray.200",
  fontSize: "xs",
  fontWeight: "bold",
  color: "gray.600",
});

export const FilterSelector: FC<{
  filter: NewsFilterMeOrAllType;
  setFilter: (_selected: NewsFilterMeOrAllType) => void;
}> = ({ filter, setFilter }) => {
  const FilterItem = ({ value }: { value: NewsFilterMeOrAllType }) => {
    const checked = filter === value;
    return (
      <label
        className={cx(
          hstack(),
          filterSelectorStyle,
          css({
            "&:has(> input:checked)": {
              backgroundColor: "gray.600",
            },
          }),
        )}>
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
    <fieldset
      className={css({
        display: "flex",
        gap: 2,
        smDown: {
          flexDirection: "column",
        },
      })}>
      {newsFiltersMeOrAll.map((category) => (
        <FilterItem key={category} value={category} />
      ))}
    </fieldset>
  );
};
