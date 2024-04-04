import { cva, cx } from "@styled-system/css";

export const RequiredBadge = ({ isRequired, className }: { isRequired: boolean; className?: string | undefined }) => {
  const style = cva({
    base: {
      paddingBlock: 0.5,
      paddingInline: 3,
      borderRadius: "sm",
      color: "white",
      fontWeight: "bold",
      fontSize: "md",
    },
    variants: {
      isRequired: {
        true: {
          backgroundColor: "black",
        },
        false: {
          backgroundColor: "gray.500",
        },
      },
    },
  });

  return <span className={cx(style({ isRequired: isRequired }), className)}>{isRequired ? "必須" : "任意"}</span>;
};
