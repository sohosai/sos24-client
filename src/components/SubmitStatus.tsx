import { cva, cx } from "@styled-system/css";

export type submitStatus = "未提出" | "提出済み" | "遅延提出";

type Props = {
  status: submitStatus;
  className?: string;
};

export const SubmitStatus = ({ status, className }: Props) => {
  const submitStatus = cva({
    base: {
      borderRadius: "md",
      paddingInline: 3,
      paddingBlock: 1,
      width: "fit-content",
      lineHeight: 1.5,
    },
    variants: {
      status: {
        未提出: {
          backgroundColor: "gray.200",
          color: "black",
        },
        提出済み: {
          backgroundColor: "sohosai.blue",
          color: "white",
        },
        遅延提出: {
          backgroundColor: "sohosai.orange",
          color: "white",
        },
      },
    },
  });

  return <span className={cx(submitStatus({ status }), className)}>{status}</span>;
};
