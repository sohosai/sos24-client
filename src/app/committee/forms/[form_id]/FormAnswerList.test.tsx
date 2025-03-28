import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { FormAnswerList } from "./FormAnswerList";
import { testAnswer } from "@/helpers/forms";

describe("FormAnswerList", () => {
  beforeEach(() => {
    cleanup();
  });
  it("回答がない場合には回答がない旨を表示する", () => {
    render(<FormAnswerList answers={[]} deadline="" />);
    expect(document.body.textContent).toContain("回答はまだありません");
  });
  it("回答が複数ある場合はその数分表示される", () => {
    render(<FormAnswerList answers={[testAnswer({}), testAnswer({})]} deadline="" />);
    expect(screen.getAllByTestId("form-answer-link")).toHaveLength(2);
  });
  it("回答に関する情報が正しく表示される", () => {
    // deadlineはgetSubmitStatusFromDateでしか使っておらずgetSubmitStatusFromDateは個別にテストを持っているのでここではテストしない
    const updatedAt = "2024-05-19T05:36:26.307030404+00:00";
    const mockAnswer = testAnswer({ updatedAt });
    render(<FormAnswerList answers={[mockAnswer]} deadline="" />);
    expect(screen.getByTestId("answered_at").textContent).toBe("05/19 14:36");
    expect(screen.getByTestId("project_title").textContent).toBe(mockAnswer.project_title);
    expect(screen.getByTestId("form-answer-link").getAttribute("href")).toBe(
      `/committee/form-answers/${mockAnswer.id}`,
    );
  });
});
