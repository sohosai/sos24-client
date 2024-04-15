import type { Dispatch, DragEvent, SetStateAction } from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import { css, cva } from "@styled-system/css";
import { basicFieldProps } from "./_components/types";

import { basicErrorMessageStyle, basicFormLabelStyle } from "./styles";

import { RequiredBadge } from "./_components/RequiredBadge";
import { FileView } from "@/components/FileView";

import clickIcon from "@/components/assets/Click.svg";
import driveIcon from "@/components/assets/Drive.svg";
import { FileErrorsType, FilesFormType } from "@/app/forms/[form_id]/FormItems";

interface Props extends basicFieldProps {
  extensions?: string[];
  limit?: number | null;
  files?: FilesFormType;
  setFiles: Dispatch<SetStateAction<FilesFormType>>;
  setErrorState: Dispatch<SetStateAction<FileErrorsType>>;
}

export const FilesField = (props: Props) => {
  const { ref, ...rest } = props.register;
  const [maxFiles, setMaxFiles] = useState(0);
  const [fileIds, setFileIds] = useState<number[]>([]);

  const filesDOM = useRef<HTMLInputElement | null>(null);
  const [isDragged, setIsDragged] = useState(false);

  //const files = props.files
  const setFiles = props.setFiles;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const validateFiles = () => {
    const files = filesDOM.current?.files;
    const fileNumber = files?.length;

    let message = "";
    if (props.required && (!fileNumber || fileNumber < 1)) {
      // 必須の場合ファイルが選択されているか確認
      message = `ファイルをアップロードしてください`;
    } else if (props.limit && fileNumber && fileNumber > props.limit) {
      // ファイルの上限数の検証
      message = `ファイルは${props.limit}個までしかアップロードできません`;
    } else if (
      extensionsRegex &&
      files &&
      [...Array(fileNumber)].some((_, i) => !extensionsRegex.test(files[i].name))
    ) {
      // ファイルの拡張子の検証
      message = `ファイルの拡張子は${props.extensions?.join("、")}のいずれかにしてください`;
    }

    if (message) {
      setErrorMessage(message ?? "");
      props.setErrorState((prev) => prev.set(props.id, message ?? ""));
    } else {
      setErrorMessage(null);
      props.setErrorState((prev) => prev.set(props.id, null));
    }
  };

  const getFiles = (event: DragEvent<HTMLDivElement>) => {
    setIsDragged(false);
    if (filesDOM.current?.files && event.dataTransfer && event.dataTransfer.files.length > 0) {
      const newFile = addFile(filesDOM.current.files, event.dataTransfer.files);
      filesDOM.current.files = newFile;
      setFiles((prev) => prev.set(props.id, newFile));
    }
  };
  const [updateFile, setUpdateFile] = useState(false);

  const addFile = (oldFiles: FileList, newFiles: FileList) => {
    setFileIds(fileIds.concat([...Array(newFiles.length)].map((_, i) => i + maxFiles)));
    setMaxFiles(maxFiles + newFiles.length);

    const newDataTransfer = new DataTransfer();
    for (let i = 0; i < oldFiles.length; i++) {
      newDataTransfer.items.add(oldFiles[i]);
    }
    for (let i = 0; i < newFiles.length; i++) {
      newDataTransfer.items.add(newFiles[i]);
    }
    return newDataTransfer.files;
  };
  const deleteFile = (files: FileList, index: number) => {
    setFileIds(fileIds.filter((_, i) => i !== index));
    const newDataTransfer = new DataTransfer();
    for (let j = 0; j < files.length; j++) {
      if (j !== index) {
        newDataTransfer.items.add(files[j]);
      }
    }
    return newDataTransfer.files;
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

  const extensionsRegex =
    props.extensions && props.extensions.length >= 1
      ? new RegExp(`(${props.extensions.map((e) => e.replaceAll(".", "\\.")).join("|")})$`, "i")
      : undefined;

  const files = filesDOM.current?.files;
  return (
    <div>
      <span className={basicFormLabelStyle}>
        {props.label}
        {props.required !== undefined && (
          <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
        )}
      </span>
      <div
        role="form"
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
          validateFiles();
        }}
        className={dropAreaStyle({ isDragged })}>
        <button
          onClick={(e) => {
            e.preventDefault();
            filesDOM.current?.click();
          }}
          className={css({
            position: "absolute",
            height: "100%",
            width: "100%",
            cursor: "pointer",
          })}></button>
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
      </div>
      <input
        type="file"
        accept={props.extensions ? props.extensions.join(",") : undefined}
        multiple={!props.limit || props.limit > 1}
        {...rest}
        ref={(e) => {
          ref(e);
          filesDOM.current = e;
        }}
        className={css({
          display: "none",
        })}
        onChange={(e) => {
          e.preventDefault();
          if (filesDOM.current?.files) {
            setFiles((prev) => prev.set(props.id, filesDOM.current?.files ?? null));
          }
          validateFiles();

          // 毎回確実にstateを更新して再レンダリングさせる
          setUpdateFile(!updateFile);
        }}
      />
      <span className={basicErrorMessageStyle}>{props.error ? props.error : errorMessage}</span>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          rowGap: 2,
        })}>
        {files &&
          [...Array(files.length)].map((_, i) => {
            const file = files && files[i];
            if (!file) {
              return;
            }

            const error = extensionsRegex ? !extensionsRegex.test(file.name) : false;
            return (
              <FileView
                key={fileIds[i]}
                name={file.name}
                error={error}
                delete={() => {
                  if (!files) {
                    return;
                  }

                  if (filesDOM.current) {
                    filesDOM.current.files = deleteFile(files, i);
                  }
                  validateFiles();
                }}
              />
            );
          })}
      </div>
    </div>
  );
};
