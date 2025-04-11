import { formStatus } from "@/lib/formHelpers";
import { cva, cx } from "@styled-system/css";

type Props = {
  status: formStatus;
  className?: string;
};

export const FormStatusBadge = ({ status, className }: Props) => {
  const formStatus = cva({
    base: {
      borderRadius: "md",
      paddingInline: 3,
      paddingBlock: 1,
      width: "fit-content",
      lineHeight: 1.5,
    },
    variants: {
      status: {
        受付終了: {
          backgroundColor: "gray.200",
          color: "black",
        },
        開始前: {
          backgroundColor: "sohosai.blue",
          color: "white",
          fontWeight: "bold",
        },
        受付中: {
          backgroundColor: "sohosai.orange",
          color: "white",
          fontWeight: "bold",
        },
        不明: {},
      },
    },
  });

  return <span className={cx(formStatus({ status }), className)}>{status}</span>;
};
