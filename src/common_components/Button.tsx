import { cva, cx } from "@styled-system/css";
import { ButtonHTMLAttributes, FC } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: "purple" | "secondary" | "blue" | "secondary_blue";
  size?: "y" | "medium" | "big";
  className?: string;
  children: React.ReactNode;
}

export const Button: FC<Props> = ({ color, size = "medium", className, children, ...props }: Props) => {
  const button = cva({
    base: {
      borderRadius: "sm",
      cursor: "pointer",
      borderWidth: 2,
      borderStyle: "solid",
    },
    variants: {
      color: {
        purple: {
          backgroundColor: "tsukuba.purple",
          color: "white",
          _hover: {
            opacity: "90%",
          },

          borderColor: "tsukuba.purple",
        },
        secondary: {
          backgroundColor: "white",
          color: "tsukuba.purple",
          _hover: {
            opacity: "75%",
          },

          borderColor: "tsukuba.purple",
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
        secondary_blue: {
          backgroundColor: "sohosai.blue",
          color: "white",
          _hover: {
            opacity: "75%",
          },

          borderColor: "sohosai.blue",
        },
      },
      size: {
        y: { paddngIline: 0, paddingBlock: 1 },
        medium: { paddingInline: 9, paddingBlock: 1 },
        big: { paddingInline: 12, paddingBlock: 2 },
      },
    },
  });

  return (
    <button className={cx(button({ color, size }), className)} {...props}>
      {children}
    </button>
  );
};
