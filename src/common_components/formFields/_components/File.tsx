import { FileView } from "@/common_components/FileView";
import { assignType } from "@/lib/openapi";
import toast from "react-hot-toast";
import useSWR from "swr";

import { sosFileType } from "@/lib/file";

interface Props {
  deleteFileFunc?: () => void;
  file: File;
  error?: boolean;
}

export const File = ({ deleteFileFunc, file, error }: Props) => {
  const isUploadedFile = file.type === sosFileType;

  const { data, error: swrError, isLoading } = useSWR(isUploadedFile && file.name ? `/files/${file.name}` : null);
  const fileData = data ? assignType("/files/{file_id}", data) : undefined;

  if (!isLoading && swrError) {
    toast.error("ファイルの読み込みに失敗しました");
    return <p>ファイルの読み込みに失敗しました: {swrError.message}</p>;
  }

  return (
    !isLoading && (
      <FileView
        name={fileData ? fileData.name : file.name}
        link={fileData?.url}
        error={error}
        delete={deleteFileFunc}
      />
    )
  );
};
