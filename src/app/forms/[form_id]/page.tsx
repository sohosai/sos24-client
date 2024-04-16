"use client";

import useSWR from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { assignType, client } from "@/lib/openapi";
import { css } from "@styled-system/css";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import { FormItems, FileErrorsType, FormFieldsType, FilesFormType } from "./FormItems";
import { getTimeLeftText, getSubmitStatusFromDate } from "@/lib/formHelpers";
import { type SubmitStatus, SubmitStatusBadge } from "@/common_components/SubmitStatus";
import { Loading } from "@/common_components/Loading";
import { Button } from "@/common_components/Button";
import { deleteAllUploadedFiles, postFiles } from "@/lib/postFile";
import { components } from "@/schema";
import { FileView } from "@/common_components/FileView";

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

  const onSubmit: SubmitHandler<FormFieldsType> = async (data) => {
    if (Array.from(fileErrors).some((v) => v[1])) {
      toast.error(`正しいファイルをアップロードしてください`);
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
              <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>{form.title}</h2>
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
              {form.attachments.length && (
                <>
                  <h3 className={css({ fontSize: "xl" })}>添付ファイル</h3>
                  {form.attachments.map((fileId, index) => (
                    <AttachFile fileId={fileId} key={index} />
                  ))}
                </>
              )}
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

const AttachFile: FC<{ fileId: string }> = ({ fileId }) => {
  const { data: fileRes, error: fileError, isLoading: fileLoading } = useSWR(`/files/${fileId}`);

  const file = assignType("/files/{file_id}", fileRes);
  if (!fileLoading && !fileError) {
    return <FileView name={file.name} link={file.url} />;
  }
};
