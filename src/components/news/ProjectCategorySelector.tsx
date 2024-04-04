import { hstack, visuallyHidden } from "@styled-system/patterns";
import { css } from "@styled-system/css";

import triangleBlackIcon from "../assets/TriangleDownBlack.svg";
import triangleWhiteIcon from "../assets/TriangleDownWhite.svg";
import Image from "next/image";

export const selectedCategories = ["me", "all"] as const;
export type SelectedCategoryType = (typeof selectedCategories)[number];

const categoryToLabel = (category: SelectedCategoryType) => {
  switch (category) {
    case "me":
      return "自分の企画対象のみ";
    case "all":
      return "全体を閲覧";
  }
};

interface ProjectCategorySelectorProps {
  selected: SelectedCategoryType;
  setSelected: (_selected: SelectedCategoryType) => void;
}

export const ProjectCategorySelector = ({ selected, setSelected }: ProjectCategorySelectorProps) => {
  const CategoryButton = ({ value }: { value: SelectedCategoryType }) => {
    const checked = selected === value;
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
          onChange={() => setSelected(value)}
          className={`${visuallyHidden()} peer`}
        />
        {checked && <Image src={triangleWhiteIcon} alt="" />}
        {!checked && <Image src={triangleBlackIcon} alt="" />}
        <span
          className={css({
            fontSize: "xs",
            fontWeight: "bold",

            color: "gray.600",
            _peerChecked: {
              color: "white",
            },
          })}>
          {categoryToLabel(value)}
        </span>
      </label>
    );
  };

  return (
    <fieldset className={hstack({})}>
      {selectedCategories.map((category) => (
        <CategoryButton key={category} value={category} />
      ))}
    </fieldset>
  );
};
