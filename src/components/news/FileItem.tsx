import downloadIcon from "../assets/Download.svg";
import Image from "next/image";
import { flex } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import toast from "react-hot-toast";

interface FileItemProps {
  file_id: string;
}

export const FileItem = ({ file_id }: FileItemProps) => {
  const { data, error, isLoading } = useSWR(`/files/${file_id}`);
  if (isLoading) {
    return;
  }
  if (error) {
    toast.error(`ファイルの読み込みに失敗しました: ${error}`);
    return;
  }

  const file = assignType("/files/{file_id}", data);

  return (
    <a
      href={file.url}
      className={flex({
        backgroundColor: "gray.100",
        borderRadius: 5,
        paddingX: 6,
        paddingY: 2,
      })}>
      <span
        className={css({
          fontSize: "xs",
          flex: 1,
        })}>
        {file.name}
      </span>
      <Image src={downloadIcon} alt="ダウンロードボタン" />
    </a>
  );
};
