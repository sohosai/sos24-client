import { cva } from "@styled-system/css";
import { FC } from "react";

type Props = {
  color: "primary" | "secondary"| "blue";
  size: "medium" | "big";
  children: React.ReactNode;
};

export const Button: FC<Props> = ({ color, size, children }: Props) => {
  const button = cva({
    base: {
      borderRadius: "sm",
      display: "block",
      cursor: "pointer",
    },
    variants: {
      color: {
        primary: {
          backgroundColor: "primary",
          color: "white",
          _hover: {
            opacity: "90%",
          },
        },
        secondary: {
          backgroundColor: "white",
          color: "primary",
          _hover: {
            opacity: "75%",
          },

          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "primary",
        },
        blue:{
            backgroundColor: "white",
            color: "sohosai.blue",
            _hover: {
              opacity: "75%",
            },

            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "sohosai.blue",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
            }
      },
      size: {
        medium: { paddingInline: 9, paddingBlock: 1 },
        big: { paddingInline: 12, paddingBlock: 2 },
      },
    },
  });

  return <button className={button({ color, size })}>{children}</button>;
};
