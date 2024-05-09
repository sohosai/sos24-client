import { css } from "@styled-system/css";
import dayjs from "dayjs";
import { FC } from "react";

import { components } from "@/schema";

import { SubmitStatusBadge } from "@/common_components/SubmitStatus";
import { getSubmitStatusFromDate, getTimeLeftText } from "@/lib/formHelpers";
import { useAtom } from "jotai";

import EyesOpenIcon from "@/assets/EyesOpen.svg?url";
import EyesClosedIcon from "@/assets/EyesClosed.svg?url";
import Image from "next/image";
import { hiddenFormIdsAtom } from "./hiddenFormIds";
import toast from "react-hot-toast";
import { NoResultNotice } from "@/common_components/NoResultNotice";
import Link from "next/link";

type Form = components["schemas"]["FormSummary"];

const formListItemStyle = css({ paddingInline: 3 });

export const FormsList: FC<{
  forms: Form[];
  showSubmitted: boolean;
}> = ({ forms, showSubmitted }) => {
  const [hiddenFormIds, setHiddenFormIds] = useAtom(hiddenFormIdsAtom);

  const filteredForm = forms.filter((form) => {
    const status = getSubmitStatusFromDate(form.ends_at, form.answered_at);
    return (!showSubmitted && status !== "未提出") || hiddenFormIds.includes(form.id);
  });
  return (
    <div
      className={css({
        width: "full",
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: "0.5fr 1fr 1fr 1fr 3fr 2fr",
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
      {filteredForm.length == 0 && (
        <div className={css({ gridColumn: "1/7" })}>
          <NoResultNotice message="申請はありません" />
        </div>
      ) : (
        <div
          className={css({
            display: "contents",
            color: "gray.500",
            fontSize: "sm",
            "& > *": {
              borderColor: "gray.500",
              borderBottom: "1px solid",
              paddingInline: 3,
            },
          })}>
          <div>非表示</div>
          <div>状態</div>
          <div>配信日</div>
          <div>締切日</div>
          <div>タイトル</div>
          <div>締切まで</div>
        </div>
      )}
      {filteredForm.map((form) => {
        const startsAt = dayjs(form.starts_at);
        const endsAt = dayjs(form.ends_at);
        const status = getSubmitStatusFromDate(form.ends_at, form.answered_at);
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
              {hiddenFormIds.includes(form.id) ? (
                <Image src={EyesClosedIcon} alt="非表示" />
              ) : (
                <Image src={EyesOpenIcon} alt="表示" />
              )}
            </button>
            <Link
              href={`/forms/${form.id}`}
              className={css({
                display: "contents",
              })}>
              <div className={css({ paddingBlock: 2, paddingInline: 2 })}>
                <SubmitStatusBadge status={status} />
              </div>
              <div className={formListItemStyle}>{startsAt.format("YYYY/MMDD")}</div>
              <div className={formListItemStyle}>{endsAt.format("YYYY/MM/DD")}</div>
              <div className={formListItemStyle}>{form.title}</div>
              <div className={formListItemStyle}>{getTimeLeftText(dayjs(), endsAt, status)}</div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
