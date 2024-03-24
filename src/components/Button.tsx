import { cva } from "@styled-system/css";
import { FC } from "react";

type Props = {
  color: "primary" | "secondary";
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
      },
      size: {
        medium: { paddingInline: 3, paddingBlock: 1 },
        big: { paddingInline: 6, paddingBlock: 3 },
      },
    },
  });

  return <button className={button({ color, size })}>{children}</button>;
};
