import { css } from "@styled-system/css";
import dayjs from "dayjs";
import { FC } from "react";

import { components } from "@/schema";

import { SubmitStatusBadge } from "@/components/SubmitStatus";
import { getSubmitStatus, getTimeLeftText } from "@/lib/formHelpers";
import { useAtom } from "jotai";

import EyesOpenIcon from "@/components/assets/EyesOpen.svg";
import EyesClosedIcon from "@/components/assets/EyesClosed.svg";
import Image from "next/image";
import { hiddenFormIdsAtom } from "./hiddenFormIds";
import toast from "react-hot-toast";

type Form = components["schemas"]["FormSummary"];
type Answer = components["schemas"]["FormAnswerSummary"];

export const FormsList: FC<{
  forms: Form[];
  answers: Answer[];
  filterUnsubmitted: boolean;
}> = ({ forms, answers, filterUnsubmitted }) => {
  const [hiddenFormIds, setHiddenFormIds] = useAtom(hiddenFormIdsAtom);

  return (
    <div
      className={css({
        width: "full",
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 3fr 2fr",
        "& > * > *": {
          pr: 4,
          lineHeight: 2,
        },
      })}>
      <div
        className={css({
          display: "contents",
          color: "gray.500",
          fontSize: "sm",
          "& > *": {
            borderColor: "gray.500",
            borderBottom: "1px solid",
          },
        })}>
        <div>非表示</div>
        <div>状態</div>
        <div>配信日</div>
        <div>締切日</div>
        <div>タイトル</div>
        <div>締切まで</div>
      </div>

      {forms.map((form) => {
        const answer = answers.find((ans) => {
          ans.id === form.id;
        });

        const startsAt = dayjs(form.starts_at);
        const endsAt = dayjs(form.ends_at);
        const status = getSubmitStatus(endsAt, answer);

        if (filterUnsubmitted && status !== "未提出") {
          return;
        }

        const isShown = hiddenFormIds.includes(form.id);

        return (
          <div
            key={form.id}
            className={css({
              display: "contents",
            })}>
            <button
              onClick={() => {
                setHiddenFormIds((prev) => {
                  if (prev.includes(form.id)) {
                    toast.success("企画を再度表示するようにしました")
                    return prev.filter((i) => i != form.id);
                  } else {
                    toast.success("企画を非表示にしました")
                    return [...prev, form.id];
                  }
                });
              }}>
              {isShown ? <Image src={EyesClosedIcon} alt="非表示" /> : <Image src={EyesOpenIcon} alt="表示" />}
            </button>
            <a
              href={`/forms/${form.id}`}
              className={css({
                display: "contents",
              })}>
              <div className={css({ paddingBlock: 2 })}>
                <SubmitStatusBadge status={status} />
              </div>
              <div>{startsAt.format("YYYY/MM/DD")}</div>
              <div>{endsAt.format("YYYY/MM/DD")}</div>
              <div>{form.title}</div>
              <div>{getTimeLeftText(dayjs(), endsAt, status)}</div>
            </a>
          </div>
        );
      })}
    </div>
  );
};
