import { components } from "@/schema";
import { center, hstack } from "@styled-system/patterns";
import { css, cx } from "@styled-system/css";
import { AttributesFormatter } from "./AttributesFormatter";

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
  const ItemStyle = center({
    width: 8,
    height: 8,
    borderRadius: "md",
    color: "gray.500",
    border: "2px solid token(colors.gray.300)",
    fontSize: "lg",
  });
  const ActiveItemStyle = css({
    backgroundColor: "tsukuba.purple",
    color: "white!",
    border: "none!",
    fontWeight: "bold",
  });
  return (
    <ul className={hstack()}>
      {attrbutesData.map((e) => (
        <li
          className={cx(
            ItemStyle,
            attributes.includes(e.rawString) && ActiveItemStyle,
          )}
          title={AttributesFormatter({ category: e.rawString })}
          key={e.rawString}
        >
          {e.string}
        </li>
      ))}
    </ul>
  );
};
