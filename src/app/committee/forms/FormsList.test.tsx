import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { FormsList, FrormSummary } from "./FormsList";
import { testFormSummaries } from "@/helpers/forms";

describe("FormsList", () => {
  it("renders NoResultNotice when there are no forms", () => {
    render(<FormsList forms={[]} />);
    expect(screen.getByTestId("no-form-found")).toBeDefined();
  });

  it("displays start date, end date, title, and time left for each form", () => {
    render(<FormsList forms={testFormSummaries} />);
    expect(screen.getAllByTestId("form-summary").length).toBe(testFormSummaries.length);
  });
});

describe("FrormSummary", () => {
  beforeAll(() => {
    cleanup();
  });
  it("displays form status, start date, end date, title, and time left", () => {
    render(<FrormSummary form={testFormSummaries[0]} />);
    expect(screen.getByTestId("starts-at").textContent).toContain("2023/11/30");
    expect(screen.getByTestId("ends-at").textContent).toBe("2023/12/01");
    expect(screen.getByTestId("form-title").textContent).toBe("大学学術イベント");
    expect(screen.getByTestId("time-left").textContent).toBe("締切を過ぎています");
  });
});
