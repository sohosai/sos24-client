import { cva } from "@styled-system/css";

export const RequiredBadge = ({ isRequired }: { isRequired: boolean }) => {
  const style = cva({
    base: {
      paddingBlock: 0.5,
      paddingInline: 3,
      borderRadius: "sm",
      color: "white",
      fontWeight: "bold",
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

  return <span className={style({ isRequired: isRequired })}>{isRequired ? "必須" : "任意"}</span>;
};
