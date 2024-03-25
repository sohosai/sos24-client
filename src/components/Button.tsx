import { cva } from "@styled-system/css";
import { ButtonHTMLAttributes, FC } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: "primary" | "secondary" | "blue";
  size?: "medium" | "big";
  children: React.ReactNode;
}

export const Button: FC<Props> = ({ color, size = "medium", children, ...props }: Props) => {
  const button = cva({
    base: {
      borderRadius: "sm",
      display: "block",
      cursor: "pointer",
      borderWidth: 2,
      borderStyle: "solid",
    },
    variants: {
      color: {
        primary: {
          backgroundColor: "primary",
          color: "white",
          _hover: {
            opacity: "90%",
          },

          borderColor: "primary",
        },
        secondary: {
          backgroundColor: "white",
          color: "primary",
          _hover: {
            opacity: "75%",
          },

          borderColor: "primary",
        },
        blue: {
          backgroundColor: "white",
          color: "sohosai.blue",
          _hover: {
            opacity: "75%",
          },

          borderColor: "sohosai.blue",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        },
      },
      size: {
        medium: { paddingInline: 9, paddingBlock: 1 },
        big: { paddingInline: 12, paddingBlock: 2 },
      },
    },
  });

  return (
    <button className={button({ color, size })} {...props}>
      {children}
    </button>
  );
};
