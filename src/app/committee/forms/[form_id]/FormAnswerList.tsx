"use client";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";
import { hstack } from "@styled-system/patterns";
import Link from "next/link";
import useSWR from "swr";
import { NoResultNotice } from "@/common_components/NoResultNotice";
import { getSubmitStatusFromDate } from "@/lib/formHelpers";
import { SubmitStatusBadge } from "@/common_components/SubmitStatus";
import dayjs from "dayjs";

export const FormAnswerList: React.FC<{ formId: string; deadline: string }> = ({ formId, deadline }) => {
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
