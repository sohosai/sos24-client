import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { flex } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import downloadIcon from "@/common_components/assets/Download.svg";
import Image from "next/image";
import { FC } from "react";

export const FileItem: FC<{
  file_id: string;
}> = ({ file_id }) => {
  const { data, error, isLoading } = useSWR(`/files/${file_id}`);
  if (isLoading) {
    return;
  }
  if (error) {
    switch (error.code) {
      case "file/not-found":
        return <p>ファイルが見つかりませんでした。</p>;
      default:
        return <p>ファイルの読み込み中に不明なエラーが発生しました。</p>;
    }
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
