import { css } from "@styled-system/css";
import dayjs from "dayjs";
import { FC } from "react";

import { components } from "@/schema";


import { NoResultNotice } from "@/components/NoResultNotice";
import Link from "next/link";
import { getCommitteeTimeLeftText, getFormStatus } from "@/lib/formHelpers";
import { FormStatusBadge } from "@/components/FormStatusBadge";

type Form = components["schemas"]["FormSummary"];

export const FormsList: FC<{
  forms: Form[];
}> = ({ forms }) => {

  return (
    <div
      className={css({
        width: "full",
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
          fontSize: "sm",
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
      {forms.length == 0 && (
        <div className={css({ gridColumn: "1/7" })}>
          <NoResultNotice message="申請はありません" />
        </div>
      )}
      {forms.map((form) => {

        const startsAt = dayjs(form.starts_at);
        const endsAt = dayjs(form.ends_at);
        const status = getFormStatus(dayjs(), startsAt, endsAt);

        return (
          <div
            key={form.id}
            className={css({
              display: "contents",
            })}>
            <Link
              href={`/committee/forms/${form.id}`}
              className={css({
                display: "contents",
              })}>
              <div className={css({ paddingBlock: 2 })}>
                <FormStatusBadge status={status} />
              </div>
              <div>{startsAt.format("YYYY/MM/DD")}</div>
              <div>{endsAt.format("YYYY/MM/DD")}</div>
              <div>{form.title}</div>
              <div>{getCommitteeTimeLeftText(dayjs(), endsAt)}</div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
