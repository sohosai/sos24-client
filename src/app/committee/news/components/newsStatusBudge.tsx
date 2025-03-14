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
        下書き: {
          backgroundColor: "gray.200",
          color: "black",
        },
        公開前: {
          backgroundColor: "sohosai.blue",
          color: "white",
        },
        公開済み: {
          backgroundColor: "sohosai.orange",
          color: "white",
        },
        不明: {},
      },
    },
  });

  return <span className={cx(formStatus({ status }), className)}>{status}</span>;
};
