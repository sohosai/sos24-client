"use client";

import useSWR from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignType, client } from "@/lib/openapi";
import { css } from "@styled-system/css";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import { FormItems, FileErrorsType, FormFieldsType, FilesFormType } from "./FormItems";
import { getTimeLeftText, getSubmitStatusFromDate } from "@/lib/formHelpers";
import { type SubmitStatus, SubmitStatusBadge } from "@/components/SubmitStatus";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/Button";
import { postFile } from "@/lib/postFile";
import { components } from "@/schema";

export const runtime = "edge";

const FormDetailPage = ({ params }: { params: { form_id: string } }) => {
  const router = useRouter();
  const id = params.form_id;

  const { data: projectRes, error: projectError, isLoading: projectLoading } = useSWR("/projects/me");
  const project = assignType("/projects/me", projectRes);

  const projectId = project?.id;

  const { data: formRes, error: formError, isLoading: formLoading } = useSWR(`/forms/${id}`);
  const form = assignType("/forms/{form_id}", formRes);

  const {
    data: answersRes,
    error: answersError,
    isLoading: answersLoading,
  } = useSWR(`/form-answers?project_id=${projectId}`);
  const _answers = assignType("/form-answers", answersRes);

  const status: SubmitStatus = getSubmitStatusFromDate(form?.ends_at, form?.answered_at);

  const deleteMultipleUploadedFiles = async (ids: (string | false | undefined)[]) => {
    return await Promise.all(
      ids.map(async (id_) => {
        if (id_) {
          // 削除できなくても無視
          await client
            .DELETE("/files/{file_id}", { params: { path: { file_id: id_ } } })
            .then()
            .catch();
        }
      }),
    );
  };

  type FileIds = { [itemId: string]: string[] };
  const deleteAllUploadedFiles = async (fileIds: FileIds) => {
    await Promise.all(
      Object.keys(fileIds).map((itemId) => {
        deleteMultipleUploadedFiles(fileIds[itemId]);
      }),
    );
  };

  const onSubmit: SubmitHandler<FormFieldsType> = async (data) => {
    if (Array.from(fileErrors).some((v) => v[1])) {
      toast.error(`正しいファイルをアップロードしてください`);
      return;
    }

    const fileIds: FileIds = {};
    for (const file of Array.from(files)) {
      if (!file[1]) {
        continue;
      }
      const ids = (
        await Promise.all(
          [...Array(file[1].length)].map(async (_, i) => {
            const f = file[1]?.item(i);
            if (!f) {
              return;
            }
            try {
              const response = (await postFile("private", f))?.ids;
              return response;
            } catch {
              toast.error("ファイルのアップロード中にエラーが発生しました");
              return false;
            }
          }),
        )
      ).flat();

      if (ids.some((v) => !v)) {
        // エラーがあったら全てのファイルを削除した上でreturn
        await deleteMultipleUploadedFiles(ids);
        return;
      }

      // falsyのもの以外を抽出(本来上の条件分岐で絞り込めているはずだが、現在のTSのバージョン(5.3.3)ではうまく推論されないためこれを書いている)
      fileIds[file[0]] = ids.flatMap((v) => v || []);
    }

    type formAnswerItems = components["schemas"]["CreateFormAnswer"]["items"];
    const items: formAnswerItems = form.items.map((item): formAnswerItems[number] => {
      const value = (() => {
        switch (item.type) {
          case "string":
            return data[item.id];
          case "int":
            const datum = data[item.id];
            return datum ? parseInt(datum ?? "") : null;
          case "file":
            return fileIds[item.id];
          case "choose_many":
            return JSON.parse(String(data[item.id] ?? "[]"));
          default:
            return data[item.id];
        }
      })();

      return {
        item_id: item.id,
        type: item.type,
        value: value,
      };
    });

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
        router.push("/forms");
      })
      .catch(async () => {
        toast.error(`申請の送信中にエラーが発生しました`);
        await deleteAllUploadedFiles(fileIds);
      });
  };

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

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
      .filter((item) => {
        item.type === "file";
      })
      .map((item) => [item.id, null]),
  );
  const [files, setFiles] = useState(filesState);

  return (
    <>
      <div
        className={css({
          padding: 5,
        })}>
        <div
          className={css({
            maxWidth: "2xl",
            marginInline: "auto",
          })}>
          {projectLoading || formLoading || answersLoading ? (
            <Loading />
          ) : projectError || formError || answersError ? (
            <p>
              申請の取得中にエラーが発生しました(
              {(projectError ? `Project: ${projectError.message} ` : "") +
                (formError ? `Forms: ${formError.message} ` : "") +
                (answersError ? `Answers: ${answersError.message}` : "")}
              )
            </p>
          ) : (
            <>
              <h2>{form.title}</h2>
              <p>
                <span>
                  {dayjs(form.ends_at).format("YYYY/MM/DD")} ({getTimeLeftText(dayjs(), dayjs(form.ends_at), status)})
                </span>
                <SubmitStatusBadge status={status} className={css({ marginInline: 3 })} />
              </p>
              <p
                className={css({
                  marginBlock: 4,
                  whiteSpace: "pre-wrap",
                })}>
                {form.description}
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={css({
                  marginBlock: 10,
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 3,
                })}>
                <FormItems
                  items={form.items}
                  getValues={getValues}
                  setValue={setValue}
                  register={register}
                  errors={errors}
                  files={files}
                  setFiles={setFiles}
                  setFileErrors={setFileErrors}
                />
                <Button color="primary">送信</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default FormDetailPage;
