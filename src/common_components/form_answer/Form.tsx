import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { css } from "@styled-system/css";
import toast from "react-hot-toast";

import { client } from "@/lib/openapi";
import { deleteAllUploadedFiles, postFiles } from "@/lib/postFile";

import { components } from "@/schema";
import { FileErrorsType, FilesFormType, FormFieldsType, FormItems } from "./FormItems";

import { buttonStyle } from "@/recipes/button";
import { sosFileType } from "@/lib/file";

interface Props {
  form: components["schemas"]["Form"];
  answerId: string | undefined;
  answerItems: FormFieldsType | undefined;
  editable: boolean;
}
// import と競合しないよう、あえて Interface と付けています
interface FileIdsInterface {
  [key: string]: any;
}

export const Form = ({ form, answerId, answerItems, editable }: Props) => {
  const onSubmit: SubmitHandler<FormFieldsType> = async (data) => {
    if (Array.from(fileErrors).some((v) => v[1])) {
      toast.error(`正しいファイルをアップロードしてください`);
      return;
    }

    if (!form) {
      toast.error("申請の読み込みが終わってから送信してください");
      return;
    }

    let fileIds: FileIdsInterface = {};
    const isFileIds = (arg: unknown): arg is FileIdsInterface =>
      typeof arg === "object" &&
      arg !== null &&
      Object.keys(arg).every((key: unknown) => typeof key === "string" && typeof (arg as any)[key] === "string");
    fileIds = await toast.promise(
      new Promise((resolve, reject) => {
        let res = postFiles("public", files);
        if (!res) {
          reject(new Error("ファイルのアップロードに失敗しました"));
        }
        if (!isFileIds(res)) {
          reject(new Error("ファイルのアップロードに失敗しました (形式エラー)"));
        } else {
          resolve(res);
        }
        return res;
      }),
      {
        loading: "ファイルをアップロード中...",
        success: "ファイルをアップロードしました",
        error: "ファイルのアップロードに失敗しました",
      },
    );
    // const fileIds = await postFiles("private", files);
    if (!fileIds) {
      toast.error("ファイルのアップロード中にエラーが発生しました");
      return;
    }

    type formAnswerItems = components["schemas"]["CreateFormAnswer"]["items"];
    const items: formAnswerItems = form.items.flatMap((item): formAnswerItems[number] | [] => {
      const datum = data[item.id];
      switch (item.type) {
        case "string":
          if (!datum) return [];
          return { item_id: item.id, type: item.type, value: datum };
        case "int":
          if (!datum) return [];
          return { item_id: item.id, type: item.type, value: parseInt(datum) };
        case "choose_one":
          if (!datum) return [];
          return { item_id: item.id, type: item.type, value: datum };
        case "choose_many":
          if (!datum) return [];
          const options = JSON.parse(datum) as string[];
          return options.length ? { item_id: item.id, type: item.type, value: options } : [];
        case "file":
          if (!fileIds.hasOwnProperty(item.id)) {
            return [];
          }
          return { item_id: item.id, type: item.type, value: fileIds[item.id] };
      }
    });

    if (answerItems) {
      if (!answerId) {
        toast.error(`申請の修正に失敗しました`);
        return;
      }
      toast.promise(
        client
          .PUT("/form-answers/{form_answer_id}", {
            params: {
              path: {
                form_answer_id: answerId,
              },
            },
            body: {
              form_id: form.id,
              items: items,
            },
          })
          .then(async ({ error }) => {
            if (error) {
              await deleteAllUploadedFiles(fileIds);
              throw new Error(error.message);
            }
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          })
          .catch(async () => {
            await deleteAllUploadedFiles(fileIds);
            throw new Error(`申請の修正に失敗しました`);
          }),
        {
          loading: "申請の修正中",
          success: "申請の修正に成功しました",
          error: "申請の修正に失敗しました",
        },
      );
    } else {
      client
        .POST("/form-answers", {
          body: {
            form_id: form.id,
            items: items,
          },
        })
        .then(async ({ error }) => {
          if (error) {
            toast.error(`申請の送信に失敗しました`);
            await deleteAllUploadedFiles(fileIds);
            return;
          }
          toast.success("申請の送信に成功しました");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch(async () => {
          toast.error(`申請の送信中にエラーが発生しました`);
          await deleteAllUploadedFiles(fileIds);
        });
    }
  };

  const fileFormErrors: FileErrorsType = new Map(
    form?.items
      .filter((item) => {
        item.type === "file";
      })
      .map((item) => [item.id, null]),
  );
  const [fileErrors, setFileErrors] = useState(fileFormErrors);

  const filesState: FilesFormType = new Map(
    form?.items
      .filter((item) => item.type === "file")
      .map((item) => {
        if (answerItems && answerItems[item.id]) {
          const dataTransfer = new DataTransfer();
          (answerItems[item.id] as unknown as string[]).forEach((fileId) => {
            const file = new File([], fileId, { type: sosFileType });
            dataTransfer.items.add(file);
          });
          return [item.id, dataTransfer.files];
        } else {
          return [item.id, null];
        }
      }),
  );
  const [files, setFiles] = useState(filesState);
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur", defaultValues: answerItems });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={css({
        display: "flex",
        flexDirection: "column",
        rowGap: 3,
      })}>
      <FormItems
        items={form.items}
        getValues={getValues}
        setValue={setValue}
        register={register}
        disabled={!!answerItems && !editable}
        errors={errors}
        files={files}
        setFiles={setFiles}
        setFileErrors={setFileErrors}
      />
      {(editable || !answerItems) && (
        <button className={buttonStyle({ visual: "solid", color: "purple" })}>{!answerItems ? "送信" : "更新"}</button>
      )}
    </form>
  );
};
