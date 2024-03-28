import dayjs from "dayjs";

import { components } from "@/schema";

type Answer = components["schemas"]["FormAnswerSummary"];
import type { submitStatus } from "@/components/FormStatus";

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

export const getSubmitStatus = (deadline: dayjs.Dayjs, answer: Answer | undefined): submitStatus => {
  if (!answer) {
    return "未提出";
  }

  if (dayjs(answer.updated_at).isBefore(deadline)) {
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
