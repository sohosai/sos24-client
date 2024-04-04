"use client";

import useSWR from "swr";
import { fetcherWithToken } from "@/lib/swr";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";

import { FormItems } from "./FormItems";
import dayjs from "dayjs";
import { getTimeLeftText } from "@/lib/formHelpers";
import { SubmitStatus, submitStatus } from "@/components/SubmitStatus";

export const config = {
  runtime: "edge",
};

const FormDetailPage = ({ params }: { params: { form_id: string } }) => {
  const id = params.form_id;

  const { data: projectRes } = useSWR("/projects/me", fetcherWithToken);
  const project = projectRes
    ? assignType("/projects/me", projectRes.json)
    : undefined;

  const projectId = project?.id;

  const { data: formRes } = useSWR(`/forms/${id}/`, fetcherWithToken);
  const form = formRes
    ? assignType("/forms/{form_id}", formRes.json)
    : undefined;

  const { data: answersRes } = useSWR(
    `/form-answers?project_id=${projectId}`,
    fetcherWithToken,
  );
  const answers = answersRes
    ? assignType("/form-answers", answersRes.json)
    : undefined;

  const status: submitStatus = "未提出";

  return (
    <>
      <div
        className={css({
          padding: 5,
        })}
      >
        <div
          className={css({
            maxWidth: "2xl",
            marginInline: "auto",
          })}
        >
          {(projectRes && !projectRes.ok) || (formRes && !formRes?.ok) ||
              (answersRes && !answersRes?.ok)
            ? (
              <p>
                申請の取得中にエラーが発生しました(
                {(projectRes && !projectRes?.ok
                  ? `Project: ${projectRes?.statusCode} `
                  : "") +
                  (formRes && !formRes?.ok
                    ? `Forms: ${formRes?.statusCode} `
                    : "") +
                  (answersRes && !answersRes?.ok
                    ? `Answers: ${answersRes?.statusCode}`
                    : "")}
                )
              </p>
            )
            : form
            ? (
              <>
                <h2>{form.title}</h2>
                <p>
                  <span>
                    {dayjs(form.ends_at).format("YYYY/MM/DD")}{" "}
                    ({getTimeLeftText(dayjs(), dayjs(form.ends_at), status)})
                  </span>
                  <SubmitStatus
                    status={status}
                    className={css({ marginInline: 3 })}
                  />
                </p>
                <p
                  className={css({
                    marginBlock: 4,
                    whiteSpace: "pre-wrap",
                  })}
                >
                  {form.description}
                </p>
                <form
                  noValidate
                  className={css({
                    marginBlock: 10,
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 3,
                  })}
                >
                  <FormItems items={form.items} />
                </form>
              </>
            )
            : (
              <p className={css({ width: "100%", textAlign: "center" })}>
                申請内容を読み込み中です……
              </p>
            )}
        </div>
      </div>
    </>
  );
};
export default FormDetailPage;
