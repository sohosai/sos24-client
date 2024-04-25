import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { css } from "@styled-system/css";
import toast from "react-hot-toast";

import { client } from "@/lib/openapi";
import { deleteAllUploadedFiles, postFiles } from "@/lib/postFile";

import { components } from "@/schema";
import { FormItems, FileErrorsType, FormFieldsType, FilesFormType } from "./FormItems";

import { buttonStyle } from "@/recipes/button";
import { sosFileType } from "@/lib/file";

interface Props {
  form: components["schemas"]["Form"];
  answerId: string | undefined;
  answerItems: FormFieldsType | undefined;
  editable: boolean;
}

export const Form = ({ form, answerId, answerItems, editable }: Props) => {
  const handleBeforeunload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (editable || !answerItems) {
        event.preventDefault();
        event.returnValue = "";
      }
    },
    [answerItems, editable],
  );
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeunload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeunload);
    };
  }, [handleBeforeunload]);
  const onSubmit: SubmitHandler<FormFieldsType> = async (data) => {
    if (Array.from(fileErrors).some((v) => v[1])) {
      toast.error(`正しいファイルをアップロードしてください`);
      return;
    }

    if (!form) {
      toast.error("申請の読み込みが終わってから送信してください");
      return;
    }

    const fileIds = await postFiles("private", files);
    if (!fileIds) {
      toast.error("ファイルのアップロード中にエラーが発生しました");
      return;
    }

    type formAnswerItems = components["schemas"]["CreateFormAnswer"]["items"];
    const items: formAnswerItems = form.items.flatMap((item): formAnswerItems[number] | [] => {
      const value = (() => {
        switch (item.type) {
          case "string":
            return data[item.id] || null;
          case "int":
            const datum = data[item.id];
            return datum ? parseInt(datum ?? "") : null;
          case "file":
            return fileIds[item.id] || null;
          case "choose_many":
            const options = JSON.parse(String(data[item.id] ?? "[]")) as string[];
            return options.length ? options : null;
          default:
            return data[item.id] || null;
        }
      })();

      return value
        ? {
            item_id: item.id,
            type: item.type,
            value: value,
          }
        : [];
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
            window.removeEventListener("beforeunload", handleBeforeunload);
            window.location.reload();
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
          window.removeEventListener("beforeunload", handleBeforeunload);
          window.location.reload();
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
