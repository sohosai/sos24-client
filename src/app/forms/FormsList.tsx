import { css } from "@styled-system/css";
import dayjs from "dayjs";
import { FC } from "react";

import { components } from "@/schema";

import { SubmitStatus } from "@/components/SubmitStatus";
import type { submitStatus } from "@/components/SubmitStatus";

type Form = components["schemas"]["FormSummary"];
type Answer = components["schemas"]["FormAnswerSummary"];

const getStatus = (deadline: dayjs.Dayjs, answer: Answer | undefined): submitStatus => {
  if (!answer) {
    return "未提出";
  }

  if (dayjs(answer.updated_at).isBefore(deadline)) {
    return "提出済み";
  } else {
    return "遅延提出";
  }
};

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
        })}>
        <div
          className={css({
            display: "contents",
            color: "gray.500",
            "& > *": {
              borderColor: "gray.500",
              borderBottom: "1px solid",
            },
          })}>
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
            const status = getStatus(endsAt, answer);
            if (filterUnsubmitted && status !== "未提出") {
              return;
            }
            const diff = endsAt.diff(dayjs(), "d");
            return (
              <a
                key={form.id}
                href={`/forms/${form.id}`}
                className={css({
                  display: "contents",
                })}>
                <div className={css({ paddingBlock: 2 })}>
                  <SubmitStatus status={status} />
                </div>
                <div>{dayjs(form.starts_at).format("YYYY/MM/DD")}</div>
                <div>{endsAt.format("YYYY/MM/DD")}</div>
                <div>{form.title}</div>
                <div>{status === "未提出" ? (diff >= 0 ? `（残り${diff}日）` : "締切を過ぎています") : ""}</div>
              </a>
            );
          })}
      </div>
      {(!forms || !answers) && <p className={css({ width: "100%", textAlign: "center" })}>読み込み中です……</p>}
    </div>
  );
};
