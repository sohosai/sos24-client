import { cva, cx } from "@styled-system/css";
import { css } from "@styled-system/css";
import { ButtonHTMLAttributes, FC } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const StatusButton: FC<Props> = ({ className, children, ...props }: Props) => {
  const button = cva({
    base: {
      cursor: "pointer",

      borderBottom: "solid",
      paddingX: 6,
      paddingY: 1,
      fontWeight: "bold",
      backgroundColor: "white",
      color: "black",
      _hover: {
        color: "gray.400",
        borderColor: "gray.400",
      },
      borderColor: "black",
    },
  });

  return (
    <button className={cx(button({}), className)} {...props}>
      {children}
    </button>
  );
};
