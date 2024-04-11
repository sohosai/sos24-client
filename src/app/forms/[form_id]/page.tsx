"use client";

import useSWR from "swr";
import { useForm } from "react-hook-form";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";

import { FormItems, formFieldsType } from "./FormItems";
import dayjs from "dayjs";
import { type SubmitStatus, SubmitStatusBadge } from "@/components/SubmitStatus";
import { getTimeLeftText, getSubmitStatusFromDate } from "@/lib/formHelpers";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/Button";

export const runtime = "edge";

const FormDetailPage = ({ params }: { params: { form_id: string } }) => {
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
  const onSubmit = async (data: formFieldsType) => {
    console.log(errors);
    console.log(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

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
                <FormItems items={form.items} register={register} errors={errors} />
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
