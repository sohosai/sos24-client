import { FC } from "react";
import { css, cx } from "@styled-system/css";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Title: FC<Props> = ({ className, children }: Props) => {
  return (
    <h2
      className={cx(
        css({
          display: "inline-block",
          fontSize: "2xl",
          fontWeight: "bold",
          paddingBottom: 2,
          borderBottomWidth: 4,
          borderBottomStyle: "solid",
          borderBottomColor: "sohosai.blue",
        }),
        className,
      )}>
      {children}
    </h2>
  );
};
