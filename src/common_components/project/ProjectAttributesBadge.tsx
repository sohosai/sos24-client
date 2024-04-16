import { components } from "@/schema";
import { hstack } from "@styled-system/patterns";
import { css, cva } from "@styled-system/css";
import { AttributesFormatter } from "./AttributesFormatter";
export const attributeSelectorStyle = css({
  paddingBlock: 2,
  paddingInline: 6,
  borderRadius: "2xl",
  cursor: "pointer",
  color: "gray.600",
  fontSize: "sm",
  outline: "3px solid token(colors.gray.300)",
  fontWeight: "bold",
  boxSizing: "border-box",
  "&:has(> input:checked)": {
    color: "tsukuba.purple",
    outline: "2px solid ",
    backgroundColor: "white",
  },
});

const attrbutesData: {
  rawString: components["schemas"]["ProjectAttribute"];
  string: string;
}[] = [
  {
    rawString: "inside",
    string: "内",
  },
  {
    rawString: "outside",
    string: "外",
  },
  {
    rawString: "academic",
    string: "学",
  },
  {
    rawString: "art",
    string: "芸",
  },
  {
    rawString: "official",
    string: "委",
  },
];

export const ProjectAttributesBadge: React.FC<{
  attributes: components["schemas"]["ProjectAttribute"][];
}> = ({ attributes }) => {
  const itemStyle = cva({
    base: {
      width: 8,
      height: 8,
      borderRadius: "md",
      color: "gray.500",
      border: "2px solid token(colors.gray.300)",
      fontSize: "lg",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    variants: {
      active: {
        true: {
          backgroundColor: "tsukuba.purple",
          color: "white!",
          border: "none!",
          fontWeight: "bold",
        },
      },
    },
    defaultVariants: {
      active: false,
    },
  });
  return (
    <ul className={hstack()}>
      {attrbutesData.map((e) => (
        <li
          className={itemStyle({ active: attributes.includes(e.rawString) })}
          title={AttributesFormatter({ attribute: e.rawString })}
          key={e.rawString}>
          {e.string}
        </li>
      ))}
    </ul>
  );
};
