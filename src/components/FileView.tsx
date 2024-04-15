import Image from "next/image";
import downloadIcon from "./assets/Download.svg";
import deleteIcon from "./assets/TrashOutline.svg";
import { css, cva } from "@styled-system/css";
import { FC } from "react";

interface Props {
  name: string;
  error?: boolean;
  delete?: () => void;
  link?: string;
}

export const fileViewStyle = cva({
  base: {
    paddingBlock: 2,
    paddingInline: 5,
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "gray.100",
    borderRadius: "md",
  },
  variants: {
    isError: {
      true: {
        borderColor: "error",
        borderWidth: 2,
        borderStyle: "solid",
      },
      false: {},
    },
  },
  defaultVariants: {
    isError: false,
  },
});

export const FileView = (props: Props) => {
  return (
    <div className={fileViewStyle({ isError: props.error })}>
      <span>{props.name}</span>
      {props.link !== undefined && <DownloadBuutton link={props.link} />}
      {props.delete !== undefined && (
        <button
          onClick={(e) => {
            e.preventDefault();
            if (props.delete !== undefined) {
              props.delete();
            }
          }}
          className={css({
            height: 6,
            width: 6,
            cursor: "pointer",
          })}>
          <Image
            src={deleteIcon}
            alt="削除"
            className={css({
              height: 5,
              width: 5,
            })}></Image>
        </button>
      )}
    </div>
  );
};

type DownloadButtonProps = { link: string };
const DownloadBuutton: FC<DownloadButtonProps> = ({ link }) => (
  <a href={link} download>
    <Image
      src={downloadIcon}
      alt="ダウンロード"
      className={css({
        height: 5,
        width: 5,
      })}
    />
  </a>
);
