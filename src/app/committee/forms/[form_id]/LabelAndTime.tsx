"use client";
import { css } from "@styled-system/css";
import { hstack } from "@styled-system/patterns";
import dayjs from "dayjs";

export const LabelAndTime: React.FC<{ label: string; time: string }> = ({ label, time }) => {
  return (
    <div className={hstack({ fontWeight: "700", gap: 9 })}>
      <span>{label}</span>
      <time dateTime={time} className={css({ letterSpacing: 3 })}>
        {dayjs(time).format("M月D日 HH:mm")}
      </time>
    </div>
  );
};
