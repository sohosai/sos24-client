"use client";
import useSWR from "swr";
import { FC, useState } from "react";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import { FormFieldsType } from "./FormItems";
import { getSubmitStatusFromDate, getTimeLeftText } from "@/lib/formHelpers";
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
                return [item.item_id, item.value];
              case "int":
                return [item.item_id, item.value];
              case "choose_one":
                return [item.item_id, item.value];
              case "choose_many":
                return [item.item_id, JSON.stringify(item.value)];
              case "file":
                return [item.item_id, item.value];
            }
          }),
        )
      : undefined;

  const status: SubmitStatus = getSubmitStatusFromDate(form?.ends_at, form?.answered_at);

  const { data, isLoading } = useSWR("/users/me");
  const me = assignType("/users/me", data);

  const [editable, setEdiatable] = useState(false);

  if (isLoading) return;

  const deadlineText = form && getTimeLeftText(dayjs(), dayjs(form.ends_at), status);
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
                  <span className={css({ marginInlineEnd: 2 })}>
                    {form && dayjs(form.ends_at).locale(ja).format("YYYY/MM/DD(ddd) HH:mm")}
                  </span>
                  <span>{deadlineText ? ` (${deadlineText})` : ""}</span>
                  <SubmitStatusBadge status={status} className={css({ marginInline: 3 })} />
                </p>
                {answerItems &&
                  (["committee_operator", "administrator"].includes(me.role) ||
                    dayjs().isBefore(dayjs(form.ends_at))) &&
                  !editable && (
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
              {form.attachments.length > 0 && (
                <>
                  <h3 className={css({ fontSize: "xl" })}>添付ファイル</h3>
                  {form.attachments.map((fileId, index) => (
                    <AttachFile fileId={fileId} key={index} />
                  ))}
                </>
              )}

              <div
                className={css({
                  marginTop: 4,
                  marginBottom: 2,
                })}>
                <Separator />
              </div>
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
