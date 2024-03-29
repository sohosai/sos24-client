import { css, cva } from "@styled-system/css";

export const basicFormStyle = cva({
  base: {
    width: "100%",
    display: "block",
    backgroundColor: "gray.100",
    padding: 2,

    borderRadius: "md",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "gray.400",
  },
  variants: {
    isInvarid: {
      true: {
        borderColor: "error",
      },
    },
  },
  defaultVariants: {
    isInvarid: false,
  },
});

export const basicFormLabelStyle = css({
  marginBlock: 2,
  fontSize: "lg",
  fontWeight: "bold",
  display: "block",
  width: "fit-content",
});

export const basicErrorMessageStyle = css({
  color: "error",
});
