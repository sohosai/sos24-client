import { hstack } from "@styled-system/patterns";

export const projectCategoryItemStyle = hstack({
  paddingBlock: 1,
  paddingInline: 4,
  borderRadius: 10,
  cursor: "pointer",

  color: "gray.600",
  backgroundColor: "gray.200",
  "&:has(> input:checked)": {
    color: "white",
    backgroundColor: "sohosai.purple",
  },
});
