import dayjs from "dayjs";

import { components } from "@/schema";
import type { SubmitStatus } from "@/common_components/SubmitStatus";

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

export const getSubmitStatus = (deadline: string | undefined, answer: Answer | undefined): SubmitStatus => {
  return getSubmitStatusFromDate(deadline, answer?.created_at);
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

export const getTimeLeftText = (now: dayjs.Dayjs, deadline: dayjs.Dayjs, status: SubmitStatus): string => {
  const diff = getTimeLeft(now, deadline);
  return diff >= 0 ? `残り${diff}日` : status === "未提出" ? "締切を過ぎています" : "";
};

export const getCommitteeTimeLeftText = (now: dayjs.Dayjs, deadline: dayjs.Dayjs) => {
  const diff = getTimeLeft(now, deadline);
  return diff >= 0 ? `残り${diff}日` : "締切を過ぎています";
};

export const multipleSelectValidater = (
  value: string[],
  required: boolean,
  maxSelection: number,
  minSelection: number,
) => {
  {
    // 必須回答の場合
    if (required) {
      if (value.length < 1) return "1個以上選択してください";
      if (value.length < minSelection) return `${minSelection}個以上選択してください`;
      if (value.length > maxSelection) return `${maxSelection}個以下選択してください`;
    } else {
      // 任意回答で無選択の場合バリデーションを実施しない
      if (value.length == 0) return;
      if (value.length < minSelection) return `回答する場合は${minSelection}個以上選択してください`;
      if (value.length > maxSelection) return `回答する場合は${maxSelection}個以下選択してください`;
    }
  }
};
