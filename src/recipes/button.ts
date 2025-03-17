import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

export const buttonStyle = cva({
  base: {
    borderRadius: "sm",
    display: "inline-block",
    cursor: "pointer",
    borderWidth: 2,
    borderStyle: "solid",
  },
  variants: {
    visual: {
      solid: {
        _hover: {
          opacity: "90%",
        },
      },
      outline: {
        backgroundColor: "white",
        _hover: {
          opacity: "75%",
        },
      },
    },
    color: {
      purple: {},
      blue: {},
    },
    shadow: {
      none: {},
      md: {
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
    },
    size: {
      y: { paddngIline: 0, paddingBlock: 1 },
      medium: { paddingInline: 9, paddingBlock: 1 },
      big: { paddingInline: 12, paddingBlock: 2 },
    },
  },
  compoundVariants: [
    {
      color: "purple",
      visual: "solid",
      css: {
        backgroundColor: "tsukuba.purple",
        color: "white",
        borderColor: "tsukuba.purple",
      },
    },
    {
      color: "purple",
      visual: "outline",
      css: {
        color: "tsukuba.purple",
        borderColor: "tsukuba.purple",
      },
    },
    {
      color: "blue",
      visual: "outline",
      css: {
        color: "sohosai.blue",
        borderColor: "sohosai.blue",
      },
    },
    {
      color: "blue",
      visual: "solid",
      css: {
        backgroundColor: "sohosai.blue",
        color: "white",
        borderColor: "sohosai.blue",
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    shadow: "none",
    visual: "solid",
  },
});

export const Button = styled("button", buttonStyle);
