import { css } from "@styled-system/css";

export const sectionTitleStyle = css({
  fontSize: "xl",
  fontWeight: "bold",
});

export const descriptionStyle = css({
  fontSize: "sm",
  color: "gray.600",
});

export const checkboxStyle = css({
  py: 1,
  px: 4,
  rounded: "full",
  background: "gray.200",
  color: "gray.500",
  fontSize: "sm",
  fontWeight: "bold",
  "&:has(:checked)": {
    background: "tsukuba.purple",
    color: "white",
  },
  "&:has(:focus)": {
    outline: "1px solid",
  },
});

export const checkboxGrpupStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
});

export const textInputStyle = css({
  border: "1px solid token(colors.gray.400)",
  background: "gray.100",
  rounded: "sm",
  width: "full",
  padding: 2,
});
