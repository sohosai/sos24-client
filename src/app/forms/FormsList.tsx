import { css } from "@styled-system/css";
import dayjs from "dayjs";
import { FC } from "react";

import { components } from "@/schema";

import { SubmitStatus } from "@/components/SubmitStatus";
import { getSubmitStatus, getTimeLeftText } from "@/lib/formHelpers";

type Form = components["schemas"]["FormSummary"];
type Answer = components["schemas"]["FormAnswerSummary"];

export const FormsList: FC<{
  forms: Form[] | undefined;
  answers: Answer[] | undefined;
  filterUnsubmitted: boolean;
}> = ({ forms, answers, filterUnsubmitted }) => {
  return (
    <div>
      <div
        className={css({
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: "1fr 1fr 1fr 3fr 2fr",
          "& > * > *": {
            pr: 4,
            lineHeight: 2,
          },
        })}
      >
        <div
          className={css({
            display: "contents",
            color: "gray.500",
            "& > *": {
              borderColor: "gray.500",
              borderBottom: "1px solid",
            },
          })}
        >
          <div>状態</div>
          <div>配信日</div>
          <div>締切日</div>
          <div>タイトル</div>
          <div>締切まで</div>
        </div>

        {!(!forms || !answers) &&
          forms.map((form, index) => {
            const answer = answers.find((ans) => {
              ans.id === form.id;
            });
            const endsAt = dayjs(form.ends_at);
            const status = getSubmitStatus(endsAt, answer);
            if (filterUnsubmitted && status !== "未提出") {
              return;
            }
            return (
              <a
                key={form.id}
                href={`/forms/${form.id}`}
                className={css({
                  display: "contents",
                })}
              >
                <div className={css({ paddingBlock: 2 })}>
                  <SubmitStatus status={status} />
                </div>
                <div>{dayjs(form.starts_at).format("YYYY/MM/DD")}</div>
                <div>{endsAt.format("YYYY/MM/DD")}</div>
                <div>{form.title}</div>
                <div>{getTimeLeftText(dayjs(), endsAt, status)}</div>
              </a>
            );
          })}
      </div>
      {(!forms || !answers) && (
        <p className={css({ width: "100%", textAlign: "center" })}>
          読み込み中です……
        </p>
      )}
    </div>
  );
};
