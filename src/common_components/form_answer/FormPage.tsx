"use client";
import useSWR from "swr";
import { FC, useState } from "react";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";
import dayjs from "dayjs";

import { FormFieldsType } from "./FormItems";
import { getTimeLeftText, getSubmitStatusFromDate } from "@/lib/formHelpers";
import { type SubmitStatus, SubmitStatusBadge } from "@/common_components/SubmitStatus";
import { Loading } from "@/common_components/Loading";
import { FileView } from "@/common_components/FileView";
import { Separator } from "@/common_components/Separator";
import { buttonStyle } from "@/recipes/button";
import { Form } from "@/common_components/form_answer/Form";
import { paths } from "@/schema";

export const runtime = "edge";

interface Props {
  answer: paths["/form-answers/{form_answer_id}"]["get"]["responses"]["200"]["content"]["application/json"] | undefined;
  answerError: any;
  answerLoading: any;
  form: paths["/forms/{form_id}"]["get"]["responses"]["200"]["content"]["application/json"] | undefined;
  formError: any;
  formLoading: any;
}

export const FormPage = ({ answer, answerError, answerLoading, form, formError, formLoading }: Props) => {
  const answerItems: FormFieldsType | undefined =
    !answerLoading && answer
      ? Object.fromEntries(
          answer.items.map((item) => {
            switch (item.type) {
              case "string":
                return [item.item_id, item.value ? (item.value as string) : null];
              case "int":
                return [item.item_id, item.value ? String(item.value) : null];
              case "choose_one":
                return [item.item_id, item.value ? (item.value as string) : null];
              case "choose_many":
                return [item.item_id, item.value ? JSON.stringify(item.value) : null];
              case "file":
                return [item.item_id, item.value ? (item.value as string[]) : null];
            }
          }),
        )
      : undefined;

  const status: SubmitStatus = getSubmitStatusFromDate(form?.ends_at, form?.answered_at);

  const [editable, setEdiatable] = useState(false);

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
          {formLoading || answerLoading ? (
            <Loading />
          ) : formError || answerError || !form ? (
            <p>
              申請の取得中にエラーが発生しました(
              {[
                formError ? `Forms: ${formError.message}` : "",
                answerError ? `Answers: ${answerError.message}` : "",
              ].join(" ")}
              )
            </p>
          ) : (
            <>
              <div
                className={css({ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBlock: 3 })}>
                <p>
                  <span>
                    {form && dayjs(form.ends_at).format("YYYY/MM/DD")} (
                    {form && getTimeLeftText(dayjs(), dayjs(form.ends_at), status)})
                  </span>
                  <SubmitStatusBadge status={status} className={css({ marginInline: 3 })} />
                </p>
                {answerItems && dayjs().isBefore(dayjs(form.ends_at)) && !editable && (
                  <button
                    className={buttonStyle({ visual: "outline", color: "blue", size: "medium", shadow: "md" })}
                    onClick={() => {
                      setEdiatable((prev) => !prev);
                    }}>
                    修正
                  </button>
                )}
              </div>
              <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>{form?.title}</h2>
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

              <Separator />
              <Form form={form} answerId={answer?.id} answerItems={answerItems} editable={editable} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

const AttachFile: FC<{ fileId: string }> = ({ fileId }) => {
  const { data: fileRes, error: fileError, isLoading: fileLoading } = useSWR(`/files/${fileId}`);

  const file = assignType("/files/{file_id}", fileRes);
  if (!fileLoading && !fileError) {
    return <FileView name={file.name} link={file.url} />;
  }
};
