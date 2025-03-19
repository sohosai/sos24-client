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
      width: "full",
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
    <div>
      <button
        className={
          (css({
            gap: 3,
            paddingX: 3,
            marginX: 3,
          }),
          cx(button({}), className))
        }
        {...props}>
        {children}
      </button>
    </div>
  );
};
