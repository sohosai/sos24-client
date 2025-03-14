import Image from "next/image";
import downloadIcon from "@/assets/Download.svg?url";
import deleteIcon from "@/assets/TrashOutline.svg?url";
import { css, cva } from "@styled-system/css";
import { FC } from "react";

import FileIcon from "@/assets/FileView/file.svg?url";
import ImageIcon from "@/assets/FileView/image.svg?url";

interface Props {
  uuid?: string;
  name?: string;
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
    width: "full",
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

import useSWR from "swr";

export const FileView = (props: Props) => {
  let fileProps = {
    name: props.name,
    url: props.link,
  };
  const { data, error, isLoading } = useSWR((!props.name || !props.link) && props.uuid ? `/files/${props.uuid}` : null);
  if ((!props.name || !props.link) && props.uuid) {
    if (isLoading) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>読み込みエラーが発生しました</div>;
    }
    fileProps = {
      name: data?.name,
      url: data?.url,
    };
  }
  return (
    <div className={fileViewStyle({ isError: props.error })}>
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        })}>
        {fileProps?.name && (
          <Image
            src={fileProps?.name.match(/\.(jpeg|jpg|gif|png)$/) ? ImageIcon : FileIcon}
            alt=""
            className={css({
              height: 5,
              width: 5,
            })}></Image>
        )}
        <span
          className={css({
            whiteSpace: "break-spaces",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
          })}>
          {fileProps?.name ?? "ファイル名を取得できませんでした"}
        </span>
      </div>
      <div className={`${css({ display: "flex", flexDirection: "row", columnGap: 4, alignItems: "center" })} mask-me`}>
        {fileProps?.url && <DownloadBuutton link={fileProps?.url} fileName={fileProps?.name ?? "unknown_file_name"} />}
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
    </div>
  );
};

type DownloadButtonProps = { link: string; fileName: string };
const DownloadBuutton: FC<DownloadButtonProps> = ({ link, fileName }) => (
  <a href={link} download={fileName} className={css({ height: "fit-content" })}>
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
