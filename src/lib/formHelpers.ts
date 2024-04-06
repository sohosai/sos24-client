import dayjs from "dayjs";

import { components } from "@/schema";
import type { submitStatus } from "@/components/SubmitStatus";

type Answer = components["schemas"]["FormAnswerSummary"];

export type formStatus = "開始前" | "受付中" | "受付終了" | "不明";

export const getFormStatus = (now: dayjs.Dayjs, startsAt: dayjs.Dayjs, endsAt: dayjs.Dayjs): formStatus => {
  if (now.isBefore(startsAt)) {
    return "開始前";
  }
  if ((now.isSame(startsAt) || now.isAfter(startsAt)) && now.isBefore(endsAt)) {
    return "受付中";
  }
  if (now.isSame(endsAt) || now.isAfter(endsAt)) {
    return "受付終了";
  }
  return "不明";
};

export const getSubmitStatus = (deadline: string | undefined, answer: Answer | undefined): submitStatus => {
  return getSubmitStatusFromDate(deadline, answer?.updated_at);
};

export const getSubmitStatusFromDate = (deadline: string | null | undefined, answer: string | null | undefined) => {
  if (!answer || !deadline) {
    return "未提出";
  }

  if (dayjs(answer).isBefore(dayjs(deadline))) {
    return "提出済み";
  } else {
    return "遅延提出";
  }
};

export const getTimeLeft = (now: dayjs.Dayjs, deadline: dayjs.Dayjs) => deadline.diff(now, "d");

export const getTimeLeftText = (now: dayjs.Dayjs, deadline: dayjs.Dayjs, status: submitStatus) => {
  const diff = getTimeLeft(now, deadline);
  return status === "未提出" ? (diff >= 0 ? `残り${diff}日` : "締切を過ぎています") : "";
};
