import { cva, cx } from "@styled-system/css";
import { ButtonHTMLAttributes, FC } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  color: "black" | "purple";
}

export const StatusButton: FC<Props> = ({ color = "black", className, children, ...props }: Props) => {
  const button = cva({
    base: {
      cursor: "pointer",
      borderBottom: "solid",
      paddingX: 6,
      paddingY: 1,
      fontWeight: "bold",
      backgroundColor: "white",
    },
    variants: {
      color: {
        black: {
          color: "black",
          _hover: {
            opacity: "90%",
            color: "gray.400",
            borderColor: "gray.400",
          },
          borderColor: "black",
        },
        purple: {
          color: "purple.400",
          _hover: {
            opacity: "40%",
            bordercolor: "purple.100",
          },

          borderColor: "purple.400",
        },
      },
    },
  });

  return (
    <button className={cx(button({ color }), className)} {...props}>
      {children}
    </button>
  );
};
