"use client";
import { css } from "@styled-system/css";
import { hstack } from "@styled-system/patterns";
import Link from "next/link";
import { NoResultNotice } from "@/common_components/NoResultNotice";
import { getSubmitStatusFromDate } from "@/lib/formHelpers";
import { SubmitStatusBadge } from "@/common_components/SubmitStatusBadge";
import dayjs from "dayjs";
import { components } from "@/schema";

export const FormAnswerList: React.FC<{ answers: components["schemas"]["FormAnswerSummary"][]; deadline: string }> = ({
  answers,
  deadline,
}) => {
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
            const status = getSubmitStatusFromDate(deadline, answer.created_at);
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
                <div className={hstack({ gap: 5 })}>
                  <span>{dayjs(answer.updated_at).format("MM/DD HH:mm")}</span>
                  <span className={css({ fontWeight: "bold" })}>{answer.project_title}</span>
                </div>
                <SubmitStatusBadge status={status} />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};
