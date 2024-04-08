"use client";

import useSWR from "swr";
import { fetcherWithToken } from "@/lib/swr";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";

import { FormItems } from "./FormItems";
import dayjs from "dayjs";
import { getTimeLeftText } from "@/lib/formHelpers";
import { SubmitStatus, submitStatus } from "@/components/SubmitStatus";

export const runtime = "edge";

const FormDetailPage = ({ params }: { params: { form_id: string } }) => {
  const id = params.form_id;

  const { data: projectRes, error: projectError } = useSWR("/projects/me", fetcherWithToken);
  const project = projectRes ? assignType("/projects/me", projectRes) : undefined;

  const projectId = project?.id;

  const { data: formRes, isLoading: formLoading, error: formError } = useSWR(`/forms/${id}/`, fetcherWithToken);
  const form = formRes ? assignType("/forms/{form_id}", formRes) : undefined;

  const { data: answersRes, error: answersError } = useSWR(`/form-answers?project_id=${projectId}`, fetcherWithToken);
  const _answers = answersRes ? assignType("/form-answers", answersRes) : undefined;

  const status: submitStatus = "未提出";
  if (formLoading) return;
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
          {formError || answersError || projectError ? (
            <p>
              申請の取得中にエラーが発生しました(
              {(projectError ? `Project: ${projectRes?.statusCode} ` : "") +
                (formError ? `Forms: ${formRes?.statusCode} ` : "") +
                (answersError ? `Answers: ${answersRes?.statusCode}` : "")}
              )
            </p>
          ) : (
            <>
              <h2>{form?.title}</h2>
              <p>
                <span>
                  {dayjs(form?.ends_at).format("YYYY/MM/DD")} ({getTimeLeftText(dayjs(), dayjs(form?.ends_at), status)})
                </span>
                <SubmitStatus status={status} className={css({ marginInline: 3 })} />
              </p>
              <p
                className={css({
                  marginBlock: 4,
                  whiteSpace: "pre-wrap",
                })}>
                {form?.description}
              </p>
              <form
                noValidate
                className={css({
                  marginBlock: 10,
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 3,
                })}>
                <FormItems items={form?.items} />
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default FormDetailPage;
