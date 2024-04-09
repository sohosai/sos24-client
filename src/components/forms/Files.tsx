import type { DragEvent } from "react";
import { FC, useRef, useState } from "react";
import Image from "next/image";
import { css, cva } from "@styled-system/css";
import { basicFormProps } from "./types";

import { basicErrorMessageStyle, basicFormLabelStyle } from "./styles";

import { RequiredBadge } from "./RequiredBadge";
import { FileView } from "@/components/FileView";

import clickIcon from "@/components/assets/Click.svg";
import driveIcon from "@/components/assets/Drive.svg";

interface Props extends basicFormProps {
  extensions: string[];
  limit: number | null;
}

export const FilesForm: FC<Props> = (props: Props) => {
  const [maxFiles, setMaxFiles] = useState(0);
  const [fileIds, setFileIds] = useState<number[]>([]);
  const filesDOM = useRef<HTMLInputElement>(null);
  const [isDragged, setIsDragged] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const validateFiles = () => {
    filesDOM.current?.setCustomValidity("");
    const isValid = filesDOM.current?.checkValidity();

    if (isValid) {
      const fileNumber = filesDOM.current?.files?.length;
      if (props.limit && fileNumber && fileNumber > props.limit) {
        filesDOM.current?.setCustomValidity(`ファイルは${props.limit}個までしかアップロードできません`);
      } else {
        filesDOM.current?.setCustomValidity("");
      }
    }

    const isValid2 = filesDOM.current?.checkValidity();

    if (!(isValid && isValid2)) {
      setErrorMessage(filesDOM.current?.validationMessage ?? "");
    } else {
      setErrorMessage(null);
    }
  };

  const getFiles = (event: DragEvent<HTMLDivElement>) => {
    setIsDragged(false);
    if (filesDOM.current?.files && event.dataTransfer && event.dataTransfer.files.length > 0) {
      filesDOM.current.files = addFile(filesDOM.current.files, event.dataTransfer.files);
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

  const files = filesDOM.current?.files;
  return (
    <div>
      <span className={basicFormLabelStyle}>
        {props.name}
        <RequiredBadge isRequired={props.required} className={css({ marginInline: 2 })} />
      </span>
      <div
        id="drop_area"
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
          onClick={() => {
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
            <Image src={clickIcon} alt="" className={css({ height: 7, width: 7 })} />
            <span className={css({ paddingInline: 2, color: "white", paddingBottom: 1 })}>or</span>
            <Image src={driveIcon} alt="" className={css({ height: 6, width: 6, marginInline: 1 })} />
          </div>
        </div>
      </div>
      <input
        type="file"
        id="userfile"
        accept={props.extensions.join(",")}
        multiple={!props.limit || props.limit > 1}
        ref={filesDOM}
        className={css({
          display: "none",
        })}
        onChange={(e) => {
          e.preventDefault();
          validateFiles();

          // 毎回確実にstateを更新して再レンダリングさせる
          setUpdateFile(!updateFile);
        }}
      />
      <span className={basicErrorMessageStyle}>{errorMessage}</span>
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
            return (
              <FileView
                key={fileIds[i]}
                name={file.name}
                delete={() => {
                  if (!files) {
                    return;
                  }

                  filesDOM.current.files = deleteFile(files, i);
                  validateFiles();
                }}
              />
            );
          })}
      </div>
    </div>
  );
};
