import { flex } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import downloadIcon from "@/assets/Download.svg?url";
import Image from "next/image";
import { FC } from "react";
import { components } from "@/schema";

export type Props = {
  file: components["schemas"]["File"];
  error?: components["schemas"]["ErrorResponse"];
};

export const FileItem: FC<Props> = ({ file, error }) => {
  if (error) {
    switch (error.code) {
      case "file/not-found":
        return <p>ファイルが見つかりませんでした。</p>;
      default:
        return <p>ファイルの読み込み中に不明なエラーが発生しました。</p>;
    }
  }

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
