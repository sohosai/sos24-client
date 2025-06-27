import { useAtom } from "jotai";
import dayjs from "dayjs";
import { css, cva } from "@styled-system/css";
import { hstack } from "@styled-system/patterns";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import { components } from "@/schema";
import { getSubmitStatusFromDate, getTimeLeftText } from "@/lib/formHelpers";
import { hiddenFormIdsAtom } from "./hiddenFormIds";

import { NoResultNotice } from "@/common_components/NoResultNotice";
import { SubmitStatusBadge } from "@/common_components/SubmitStatusBadge";

import EyesOpenIcon from "@/assets/EyesOpen.svg?url";
import EyesClosedIcon from "@/assets/EyesClosed.svg?url";
import Triangle from "@/assets/Triangle.svg?url";

type Form = components["schemas"]["FormSummary"];
interface Props {
  forms: Form[];
  showHiddenToggle?: boolean;
}
export const FormList = ({ forms, showHiddenToggle }: Props) => {
  const [hiddenFormIds, setHiddenFormIds] = useAtom(hiddenFormIdsAtom);
  return (
    <div
      className={cva({
        base: {
          width: "full",
          md: {
            display: "grid",
          },
          alignItems: "center",
          "& > * > *": {
            pr: 4,
            lineHeight: 2,
          },
        },
        variants: {
          column: {
            5: {
              gridTemplateColumns: "max-content max-content max-content 1fr max-content",
            },
            6: {
              gridTemplateColumns: "max-content max-content max-content max-content 1fr max-content",
            },
          },
        },
      })({ column: showHiddenToggle ? 6 : 5 })}>
      <div
        className={css({
          md: {
            display: "contents",
            color: "gray.500",
            fontSize: "sm",
            "& > *": {
              borderColor: "gray.500",
              borderBottom: "1px solid",
              paddingInline: 2,
            },
          },
          base: {
            display: "none",
          },
        })}>
        {showHiddenToggle && <div>非表示</div>}
        <div>状態</div>
        <div>配信日</div>
        <div>締切日</div>
        <div>タイトル</div>
        <div>締切まで</div>
      </div>
      {forms.length == 0 && (
        <div className={css({ gridColumn: "1/7" })}>
          <NoResultNotice message="表示する申請はありません" />
        </div>
      )}
      <div
        className={css({
          display: "contents",
          "& > div": {
            display: "flex",
            justifyContent: "space-between",
            paddingInline: 0,
            paddingBlock: 3,

            borderStyle: "dotted",
            borderBlockEnd: 4,
            borderColor: "gray.200",
            sm: {
              paddingInline: 4,
            },
            md: {
              display: "contents",
            },
          },
        })}>
        {forms.map((form) => {
        
          const startsAt = dayjs(form.starts_at);
          const endsAt = dayjs(form.ends_at);
          const status = getSubmitStatusFromDate(form.ends_at, form.answered_at);
          return (
            <div key={form.id}>
              {showHiddenToggle && (
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
                  }}
                  className={css({
                    display: "none",
                    md: { cursor: "pointer", width: "100%", display: "flex", justifyContent: "center" },
                  })}>
                  {hiddenFormIds.includes(form.id) ? (
                    <Image src={EyesClosedIcon} alt="非表示" />
                  ) : (
                    <Image src={EyesOpenIcon} alt="表示" />
                  )}
                </button>
              )}
              <Link href={`/forms/${form.id}`} className={css({ display: "contents" })}>
                <div
                  className={css({
                    md: { display: "none" },
                    base: {},
                  })}>
                  <h4 className={css({ display: "flex", gap: 2 })}>
                    <Image src={Triangle} alt="" /> {form.title}
                  </h4>
                  <div className={hstack()}>
                    <time dateTime={startsAt.toISOString()}>{startsAt.format("YYYY/MM/DD")}</time>→
                    <time dateTime={endsAt.toISOString()}>{endsAt.format("YYYY/MM/DD")}</time>
                    <SubmitStatusBadge status={status} />
                  </div>
                </div>
                {/* Desktop */}
                <div
                  className={css({
                    base: {
                      display: "none",

                      "& > div": {
                        paddingInline: 3,
                      },
                    },
                    md: { display: "contents" },
                  })}>
                  <div className={css({ paddingBlock: 2, paddingInline: 2 })}>
                    <SubmitStatusBadge status={status} />
                  </div>
                  <div>{startsAt.format("YYYY/MM/DD")}</div>
                  <div>{endsAt.format("YYYY/MM/DD")}</div>
                  <div>{form.title}</div>
                  <div>{getTimeLeftText(dayjs(), endsAt, status)}</div>
                </div>
              </Link>
              {/* SP */}
              {showHiddenToggle && (
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
                  }}
                  className={css({
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    paddingInline: 2,
                    md: { display: "none" },
                    flexShrink: 0,
                  })}>
                  {hiddenFormIds.includes(form.id) ? (
                    <Image src={EyesClosedIcon} alt="非表示" />
                  ) : (
                    <Image src={EyesOpenIcon} alt="表示" />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
