import { newsStatus } from "@/lib/newsHelpers";
import { cva, cx } from "@styled-system/css";

type Props = {
  status: newsStatus;
  className?: string;
};

export const NewsStatusBadge = ({ status, className }: Props) => {
  const newsStatus = cva({
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
          backgroundColor: "#E8DAFA", //tsukuba.purpleの薄い板どっかにあればそっち採用したい
          color: "tsukuba.purple",
        },
        公開前: {
          backgroundColor: "sohosai.blue",
          color: "white",
        },
        公開済: {
          backgroundColor: "sohosai.orange",
          color: "white",
        },
        不明: {},
      },
    },
  });

  return <span className={cx(newsStatus({ status }), className)}>{status}</span>;
};
