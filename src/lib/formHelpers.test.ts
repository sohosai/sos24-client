import { describe, it, expect } from "vitest";
import dayjs from "dayjs";
import {
  getCommitteeTimeLeftText,
  getFormStatus,
  getSubmitStatusFromDate,
  getTimeLeft,
  getTimeLeftText,
  multipleSelectValidater,
} from "./formHelpers";
import { SubmitStatus } from "@/common_components/SubmitStatusBadge";

describe("getFormStatus", () => {
  //is_draftがfalseの場合
  it('nowがstartsAtの前の場合、"開始前"を返す', () => {
    const now = dayjs("2023-01-01");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = false;
    expect(getFormStatus( is_draft ,now, startsAt, endsAt)).toBe("開始前");
  });

  it('nowがstartsAtと同じ場合、"受付中"を返す', () => {
    const now = dayjs("2023-01-02");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = false;
    expect(getFormStatus( is_draft ,now, startsAt, endsAt)).toBe("受付中");
  });

  it('nowがstartsAtの後でendsAtの前の場合、"受付中"を返す', () => {
    const now = dayjs("2023-01-02T12:00:00");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = false;
    expect(getFormStatus(is_draft,now, startsAt, endsAt)).toBe("受付中");
  });

  it('nowがendsAtと同じ場合、"受付終了"を返す', () => {
    const now = dayjs("2023-01-03");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = false;
    expect(getFormStatus(is_draft,now, startsAt, endsAt)).toBe("受付終了");
  });

  it('nowがendsAtの後の場合、"受付終了"を返す', () => {
    const now = dayjs("2023-01-04");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = false;
    expect(getFormStatus(is_draft,now, startsAt, endsAt)).toBe("受付終了");
  });

  it('日付が無効な場合、"不明"を返す', () => {
    const now = dayjs("invalid-date");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = false;
    expect(getFormStatus(is_draft,now, startsAt, endsAt)).toBe("不明");
  });

//is_draftがtruteなら下書きを返す
  it('nowがstartsAtの前の場合、"開始前"を返す', () => {
    const now = dayjs("2023-01-01");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = true;
    expect(getFormStatus( is_draft ,now, startsAt, endsAt)).toBe("下書き");
  });

  it('nowがstartsAtと同じ場合、"受付中"を返す', () => {
    const now = dayjs("2023-01-02");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = true;
    expect(getFormStatus( is_draft ,now, startsAt, endsAt)).toBe("下書き");
  });

  it('nowがstartsAtの後でendsAtの前の場合、"受付中"を返す', () => {
    const now = dayjs("2023-01-02T12:00:00");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = true;
    expect(getFormStatus(is_draft,now, startsAt, endsAt)).toBe("下書き");
  });

  it('nowがendsAtと同じ場合、"受付終了"を返す', () => {
    const now = dayjs("2023-01-03");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = true;
    expect(getFormStatus(is_draft,now, startsAt, endsAt)).toBe("下書き");
  });

  it('nowがendsAtの後の場合、"受付終了"を返す', () => {
    const now = dayjs("2023-01-04");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = true;
    expect(getFormStatus(is_draft,now, startsAt, endsAt)).toBe("下書き");
  });

  it('日付が無効な場合、"不明"を返す', () => {
    const now = dayjs("invalid-date");
    const startsAt = dayjs("2023-01-02");
    const endsAt = dayjs("2023-01-03");
    const is_draft:boolean = true;
    expect(getFormStatus(is_draft,now, startsAt, endsAt)).toBe("下書き");
  });
});



describe("getSubmitStatusFromDate", () => {
  it("answerがnullかundefindの場合は未提出を返す", () => {
    expect(getSubmitStatusFromDate("2023-10-01", null)).toBe("未提出");
    expect(getSubmitStatusFromDate("2023-10-01", undefined)).toBe("未提出");
  });

  it("deadlineがnullかundefindの場合は未提出を返す", () => {
    expect(getSubmitStatusFromDate(null, "2023-09-30")).toBe("未提出");
    expect(getSubmitStatusFromDate(undefined, "2023-09-30")).toBe("未提出");
  });

  it("answerがdeadlineより前の場合は提出済みを返す", () => {
    expect(getSubmitStatusFromDate("2023-10-01", "2023-09-30")).toBe("提出済み");
  });

  it("answerがdeadlineよりあとの場合は遅延提出を返す", () => {
    expect(getSubmitStatusFromDate("2023-10-01", "2023-10-02")).toBe("遅延提出");
  });

  it("answerとdeadlineが同じ場合は提出済みを返す", () => {
    expect(getSubmitStatusFromDate("2023-10-01", "2023-10-01")).toBe("提出済み");
  });
});

describe("getTimeLeft", () => {
  it("現在の日時が締め切りより前の場合、残りの日数を返すべき", () => {
    const now = dayjs("2023-09-28");
    const deadline = dayjs("2023-10-01");
    expect(getTimeLeft(now, deadline)).toBe(3);
  });

  it("現在の日時が締め切りと同じ場合、残りの日数は0であるべき", () => {
    const now = dayjs("2023-10-01");
    const deadline = dayjs("2023-10-01");
    expect(getTimeLeft(now, deadline)).toBe(0);
  });

  it("現在の日時が締め切りを過ぎている場合、負の残り日数を返すべき", () => {
    const now = dayjs("2023-10-02");
    const deadline = dayjs("2023-10-01");
    expect(getTimeLeft(now, deadline)).toBe(-1);
  });
});

describe("getTimeLeftText", () => {
  it('残り日数が0以上で、statusが"未提出"の場合、残り日数のテキストを返すべき', () => {
    const now = dayjs("2023-09-28");
    const deadline = dayjs("2023-10-01");
    const status: SubmitStatus = "未提出";
    expect(getTimeLeftText(now, deadline, status)).toBe("残り3日");
  });

  it('残り日数が0以上で、statusが"提出済み"の場合、残り日数のテキストを返すべき', () => {
    const now = dayjs("2023-09-28");
    const deadline = dayjs("2023-10-01");
    const status: SubmitStatus = "提出済み";
    expect(getTimeLeftText(now, deadline, status)).toBe("残り3日");
  });

  it('残り日数が負で、statusが"未提出"の場合、"締切を過ぎています"のテキストを返すべき', () => {
    const now = dayjs("2023-10-02");
    const deadline = dayjs("2023-10-01");
    const status: SubmitStatus = "未提出";
    expect(getTimeLeftText(now, deadline, status)).toBe("締切を過ぎています");
  });

  it('残り日数が負で、statusが"提出済み"の場合、空の文字列を返すべき', () => {
    const now = dayjs("2023-10-02");
    const deadline = dayjs("2023-10-01");
    const status: SubmitStatus = "提出済み";
    expect(getTimeLeftText(now, deadline, status)).toBe("");
  });

  it('残り日数が負で、statusが"遅延提出"の場合、空の文字列を返すべき', () => {
    const now = dayjs("2023-10-02");
    const deadline = dayjs("2023-10-01");
    const status: SubmitStatus = "遅延提出";
    expect(getTimeLeftText(now, deadline, status)).toBe("");
  });
});

describe("getCommitteeTimeLeftText", () => {
  it("残り日数が0以上の場合、残り日数のテキストを返すべき", () => {
    const now = dayjs("2023-09-28");
    const deadline = dayjs("2023-10-01");
    expect(getCommitteeTimeLeftText(now, deadline)).toBe("残り3日");
  });

  it("残り日数が0の場合、残り日数のテキストを返すべき", () => {
    const now = dayjs("2023-10-01");
    const deadline = dayjs("2023-10-01");
    expect(getCommitteeTimeLeftText(now, deadline)).toBe("残り0日");
  });

  it('残り日数が負の場合、"締切を過ぎています"のテキストを返すべき', () => {
    const now = dayjs("2023-10-02");
    const deadline = dayjs("2023-10-01");
    expect(getCommitteeTimeLeftText(now, deadline)).toBe("締切を過ぎています");
  });
});

describe("multipleSelectValidater", () => {
  it('必須回答で選択が1つもない場合、"1個以上選択してください"を返すべき', () => {
    const value: string[] = [];
    const required = true;
    const maxSelection = 3;
    const minSelection = 1;
    expect(multipleSelectValidater(value, required, maxSelection, minSelection)).toBe("1個以上選択してください");
  });

  it('必須回答で選択が最小選択数未満の場合、"{minSelection}個以上選択してください"を返すべき', () => {
    const value: string[] = ["option1"];
    const required = true;
    const maxSelection = 3;
    const minSelection = 2;
    expect(multipleSelectValidater(value, required, maxSelection, minSelection)).toBe("2個以上選択してください");
  });

  it('必須回答で選択が最大選択数を超える場合、"{maxSelection}個以下選択してください"を返すべき', () => {
    const value: string[] = ["option1", "option2", "option3", "option4"];
    const required = true;
    const maxSelection = 3;
    const minSelection = 1;
    expect(multipleSelectValidater(value, required, maxSelection, minSelection)).toBe("3個以下選択してください");
  });

  it("任意回答で選択がない場合、バリデーションを実施しない", () => {
    const value: string[] = [];
    const required = false;
    const maxSelection = 3;
    const minSelection = 1;
    expect(multipleSelectValidater(value, required, maxSelection, minSelection)).toBeUndefined();
  });

  it('任意回答で選択が最小選択数未満の場合、"回答する場合は{minSelection}個以上選択してください"を返すべき', () => {
    const value: string[] = ["option1"];
    const required = false;
    const maxSelection = 3;
    const minSelection = 2;
    expect(multipleSelectValidater(value, required, maxSelection, minSelection)).toBe(
      "回答する場合は2個以上選択してください",
    );
  });

  it('任意回答で選択が最大選択数を超える場合、"回答する場合は{maxSelection}個以下選択してください"を返すべき', () => {
    const value: string[] = ["option1", "option2", "option3", "option4"];
    const required = false;
    const maxSelection = 3;
    const minSelection = 1;
    expect(multipleSelectValidater(value, required, maxSelection, minSelection)).toBe(
      "回答する場合は3個以下選択してください",
    );
  });
});
