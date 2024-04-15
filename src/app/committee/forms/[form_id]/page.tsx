"use client";

import { Separator } from "@/components/Separator";
import { assignType } from "@/lib/openapi";
import { css, cx } from "@styled-system/css";
import { container, hstack, vstack } from "@styled-system/patterns";
import { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";
import { FormDetailedView } from "./FormDetailedView";
import { NoResultNotice } from "@/components/NoResultNotice";
import { getSubmitStatusFromDate } from "@/lib/formHelpers";
import { SubmitStatusBadge } from "@/components/SubmitStatus";
import dayjs from "dayjs";

export const runtime = "edge";

const FormAnswerList: React.FC<{ formId: string; deadline: string }> = ({ formId, deadline }) => {
  const { data, isLoading, error } = useSWR(`/form-answers?form_id=${formId}`);
  const answers = assignType("/form-answers", data);
  if (isLoading) return;
  if (error) return `エラーが発生しました${error}`;
  return (
    <>
      <h2 className={css({ fontSize: "lg", fontWeight: "bold" })}>個別回答一覧</h2>
      {answers.length == 0 ? (
        <NoResultNotice message="回答はまだありません" />
      ) : (
        <div
          className={css({
            width: "full",
          })}>
          {answers.map((answer) => {
            const status = getSubmitStatusFromDate(deadline, answer.updated_at);
            return (
              <Link
                href={`/committee/form-answers/${answer.id}`}
                key={answer.id}
                className={hstack({
                  width: "full",
                  justifyContent: "space-between",
                  paddingX: 5,
                  paddingY: 3,
                  "&:first-child": {
                    borderTop: "2px solid black",
                  },
                  borderBottom: "2px solid token(colors.gray.300)",
                })}>
                <span>{answer.project_title}</span>
                <div className={hstack()}>
                  <span>{dayjs(answer.updated_at).format("YYYY/MM/DD")}</span>
                  <SubmitStatusBadge status={status} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

const FormDetailedPage: NextPage<{ params: { form_id: string } }> = ({ params }) => {
  const { data: formData, isLoading: formIsLoading, error: formError } = useSWR(`/forms/${params.form_id}`);
  const form = assignType("/forms/{form_id}", formData);
  if (formIsLoading) return;
  if (formError) return "エラーが発生しました";
  return (
    <main className={cx(container({ maxWidth: "4xl", paddingY: 4 }))}>
      <div className={vstack({ gap: 4, alignItems: "start", width: "full" })}>
        <Link href="/committee/forms" className={css({ color: "sohosai.purple", display: "block" })}>
          ←申請一覧へ
        </Link>
        <FormDetailedView form={form} />
        <Separator />
        <FormAnswerList formId={form.id} deadline={form.ends_at} />
      </div>
    </main>
  );
};

export default FormDetailedPage;
