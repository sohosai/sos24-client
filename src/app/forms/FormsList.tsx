import { css } from "@styled-system/css";
import dayjs from "dayjs";
import { FC } from "react";

import { components } from "@/schema";

import { SubmitStatusBadge } from "@/components/SubmitStatus";
import { getSubmitStatusFromDate, getTimeLeftText } from "@/lib/formHelpers";
import { useAtom } from "jotai";

import EyesOpenIcon from "@/components/assets/EyesOpen.svg";
import EyesClosedIcon from "@/components/assets/EyesClosed.svg";
import Image from "next/image";
import { hiddenFormIdsAtom } from "./hiddenFormIds";
import toast from "react-hot-toast";
import { NoResultNotice } from "@/components/NoResultNotice";
import Link from "next/link";

type Form = components["schemas"]["FormSummary"];

export const FormsList: FC<{
  forms: Form[];
  showSubmitted: boolean;
}> = ({ forms, showSubmitted }) => {
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
      {forms.length == 0 && (
        <div className={css({ gridColumn: "1/7" })}>
          <NoResultNotice message="申請はありません" />
        </div>
      )}
      {forms.map((form) => {
        const startsAt = dayjs(form.starts_at);
        const endsAt = dayjs(form.ends_at);
        const status = getSubmitStatusFromDate(form.ends_at, form.answered_at);

        if (!showSubmitted && status !== "未提出") {
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
                    toast.success("申請を再度表示するようにしました");
                    return prev.filter((i) => i != form.id);
                  } else {
                    toast.success("申請を非表示にしました");
                    return [...prev, form.id];
                  }
                });
              }}>
              {isShown ? <Image src={EyesClosedIcon} alt="非表示" /> : <Image src={EyesOpenIcon} alt="表示" />}
            </button>
            <Link
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
            </Link>
          </div>
        );
      })}
    </div>
  );
};
