import { Dispatch, DragEvent, SetStateAction, useState, useRef } from "react";
import Image from "next/image";
import { css, cva } from "@styled-system/css";
import { basicDescriptionStyle, basicFormLabelStyle } from "@/common_components/formFields/styles";
import { RequiredBadge } from "@/common_components/formFields/_components/RequiredBadge";
import clickIcon from "@/assets/Click.svg?url";
import driveIcon from "@/assets/Drive.svg?url";
import { FileView } from "@/common_components/FileView";
import { postFiles } from "@/lib/postFile";
import toast from "react-hot-toast";

import { filesStatus } from "./FilesInterfaces";

async function uploadFiles(files: FileList): Promise<filesStatus[]> {
  const res = await toast.promise(postFiles("public", new Map<string, FileList>([["attachments", files]])), {
    loading: "ファイルをアップロードしています",
    success: "ファイルのアップロードに成功しました",
    error: (error) => {
      return "ファイルのアップロードに失敗しました" + (error?.message ? ` (${error?.message})` : "");
    },
  });
  return (
    res?.attachments.map((uuid: string, index: number) => ({
      name: files[index].name,
      uuid,
    })) ?? []
  );
}

export const FilesField = ({
  label,
  description,
  required,
  register,
  filesStatus,
  setFilesStatus,
}: {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  register: any;
  setErrorState: Dispatch<SetStateAction<Map<string, string | null>>>;
  filesStatus: filesStatus[];
  setFilesStatus: Dispatch<SetStateAction<filesStatus[]>>;
}) => {
  const [isDragged, setIsDragged] = useState(false);
  const fileRef = useRef<HTMLInputElement>();

  const getFiles = async (event: DragEvent<HTMLDivElement | HTMLButtonElement>) => {
    setIsDragged(false);
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const newFileStatuses = await uploadFiles(event.dataTransfer.files);
      setFilesStatus((prev) => [...prev, ...newFileStatuses]);
    }
  };

  const dropAreaStyle = cva({
    base: {
      position: "relative",
      height: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderStyle: "dashed",
      borderWidth: 2,
      borderColor: "gray.600",
    },
    variants: {
      isDragged: {
        true: {
          backgroundColor: "gray.700",
        },
        false: {
          backgroundColor: "gray.300",
        },
      },
    },
  });

  return (
    <div>
      <span className={basicFormLabelStyle}>
        {label}
        {required !== undefined && <RequiredBadge isRequired={required} className={css({ marginInline: 2 })} />}
      </span>
      {description && <p className={basicDescriptionStyle}>{description}</p>}
      <button
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragged(true);
        }}
        onDragLeave={() => {
          setIsDragged(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          getFiles(e);
        }}
        className={`${dropAreaStyle({ isDragged })} ${css({
          cursor: "pointer",
          width: "full",
        })}`}
        onClick={(e) => {
          e.preventDefault();
          fileRef.current?.click();
        }}>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          })}>
          <span
            className={cva({
              base: {
                borderRadius: "md",
                paddingInline: 3,
                paddingBlock: 1,
                marginBlock: 2,
              },
              variants: {
                isDragged: {
                  true: {
                    backgroundColor: "gray.100",
                    color: "gray.600",
                  },
                  false: {
                    backgroundColor: "gray.600",
                    color: "white",
                  },
                },
              },
            })({ isDragged })}>
            ファイル
          </span>
          <div
            className={css({
              display: "flex",
              alignItems: "center",
            })}>
            <Image src={clickIcon} alt="クリック" className={css({ height: 7, width: 7 })} />
            <span className={css({ paddingInline: 2, color: "white", paddingBottom: 1 })}>or</span>
            <Image src={driveIcon} alt="ファイルをドロップ" className={css({ height: 6, width: 6, marginInline: 1 })} />
          </div>
        </div>
      </button>
      <input
        type="file"
        multiple
        {...register}
        className={css({
          display: "none",
        })}
        ref={fileRef}
        onChange={async (e) => {
          e.preventDefault();
          if (e.target.files) {
            const newFileStatuses = await uploadFiles(e.target.files);
            setFilesStatus((prev) => [...prev, ...newFileStatuses]);
            register.onChange(e);
          }
        }}
      />
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          rowGap: 2,
          mt: 2,
        })}>
        {filesStatus &&
          filesStatus.map((fileStatus, i) => {
            return (
              <FileView
                key={fileStatus.uuid}
                uuid={fileStatus.uuid}
                delete={() => {
                  setFilesStatus((prev) => prev.filter((_, index) => index !== i));
                }}
              />
            );
          })}
      </div>
    </div>
  );
};
