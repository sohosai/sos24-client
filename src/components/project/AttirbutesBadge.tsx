import { components } from "@/schema";
import { center, hstack } from "@styled-system/patterns";
import { css, cx } from "@styled-system/css";

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
    backgroundColor: "sohosai.purple",
    color: "white!",
    border: "none!",
    fontWeight: "bold",
  });
  return (
    <ul className={hstack()}>
      <li className={cx(ItemStyle, attributes.includes("inside") && ActiveItemStyle)} title="屋内">
        内
      </li>
      <li className={cx(ItemStyle, attributes.includes("outside") && ActiveItemStyle)} title="屋外">
        外
      </li>
      <li className={cx(ItemStyle, attributes.includes("academic") && ActiveItemStyle)} title="学術認定企画">
        学
      </li>
      <li className={cx(ItemStyle, attributes.includes("art") && ActiveItemStyle)} title="芸術祭参加企画">
        芸
      </li>
      <li className={cx(ItemStyle, attributes.includes("official") && ActiveItemStyle)} title="委員会開催企画">
        委
      </li>
    </ul>
  );
};
