import { css } from "@styled-system/css";
import Link from "next/link";
import dayjs from "dayjs";
import { FC } from "react";

import { components } from "@/schema";
import { NoResultNotice } from "@/common_components/NoResultNotice";
import { getCommitteeTimeLeftText, getFormStatus } from "@/lib/formHelpers";
import { FormStatusBadge } from "@/common_components/FormStatusBadge";

type Form = components["schemas"]["FormSummary"];
import { Button } from "@/common_components/Button";
import plusIcon from "@/assets/Plus.svg?url";
import Image from "next/image";
import { flex } from "@styled-system/patterns";
import { useRouter } from "next/navigation";
import { FormStatusBar } from "./components/FormStatusBar";

export interface sortStatus {
  sortstatus: "開始前" | "下書き" | "受付中" | "受付終了" | "all";
}
        
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
const router = useRouter();

export const FormsList: FC<
  {
    forms: Form[];
  } & sortStatus
> = ({ forms, sortstatus }) => {

import useSWR from "swr";
import { assignType } from "@/lib/openapi";
  const router = useRouter();

  const { data: data_user, isLoading: isLoading_user } = useSWR("/users/me");
  const me = assignType("/users/me", data_user);

  return (
    <div
      className={css({
        width: "full",
      })}>
      <div
        className={css({
          width: "full",
          display: "grid",
          justifyContent: "flex-end",
        })}>
        {!isLoading_user && ["committee_editor", "committee_operator", "administrator"].includes(me.role) && (
          <Button
            color="blue"
            onClick={() => router.push("/committee/forms/new")}
            className={flex({
              alignItems: "center",
              gap: 2,
              paddingX: 6,
            })}>
            <Image src={plusIcon} alt="" />
            <span
              className={css({
                fontSize: "xs",
                fontWeight: "bold",
              })}>
              新規作成
            </span>
          </Button>
        )}
      </div>
      <FormStatusBar SortStatus={sortstatus} />
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
            color: "black",
            fontSize: "sm",
            "& > *": {
              borderColor: "black",
              borderBottom: "1px solid",
            },
          })}>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>状態</div>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>配信日</div>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>締切日</div>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>タイトル</div>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>締切まで</div>
        </div>
        {forms.length == 0 && (
          <div className={css({ gridColumn: "1/7" })}>
            <NoResultNotice message="申請はありません" />
          </div>
        )}
        {forms
          .filter((form) => {
            const startsAt = dayjs(form.starts_at);
            const endsAt = dayjs(form.ends_at);
            const is_draft = form.is_draft;
            const status = getFormStatus(is_draft, dayjs(), startsAt, endsAt);
            if (sortstatus === "all") {
              return true;
            } else if (sortstatus === status) {
              return true;
            }
          })
          .map((form) => {
            const startsAt = dayjs(form.starts_at);
            const endsAt = dayjs(form.ends_at);
            const is_draft = form.is_draft;
            const status = getFormStatus(is_draft, dayjs(), startsAt, endsAt);

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
                  <div className={css({ fontSize: "sm", fontWeight: "bold" })}>{startsAt.format("YYYY/MM/DD")}</div>
                  <div className={css({ fontSize: "sm", fontWeight: "bold" })}>{endsAt.format("YYYY/MM/DD")}</div>
                  <div>{form.title}</div>
                  <div className={css({ fontSize: "sm", fontWeight: "bold" })}>
                    {getCommitteeTimeLeftText(dayjs(), endsAt)}
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};
