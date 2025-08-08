import { describe, it, expect } from "vitest";
import { hasRegexSpecialCharacters } from "./textUtils";

describe("hasRegexSpecialCharacters", () => {
  it("正規表現特殊文字が含まれている場合はtrueを返す", () => {
    expect(hasRegexSpecialCharacters("*")).toBe(true);
    expect(hasRegexSpecialCharacters("+")).toBe(true);
    expect(hasRegexSpecialCharacters("?")).toBe(true);
    expect(hasRegexSpecialCharacters("^")).toBe(true);
    expect(hasRegexSpecialCharacters("$")).toBe(true);
    expect(hasRegexSpecialCharacters("{")).toBe(true);
    expect(hasRegexSpecialCharacters("}")).toBe(true);
    expect(hasRegexSpecialCharacters("(")).toBe(true);
    expect(hasRegexSpecialCharacters(")")).toBe(true);
    expect(hasRegexSpecialCharacters("|")).toBe(true);
    expect(hasRegexSpecialCharacters("[")).toBe(true);
    expect(hasRegexSpecialCharacters("]")).toBe(true);
    expect(hasRegexSpecialCharacters("\\")).toBe(true);
    expect(hasRegexSpecialCharacters(".")).toBe(true);
    expect(hasRegexSpecialCharacters(".jpg")).toBe(true);
    expect(hasRegexSpecialCharacters("*.jpg")).toBe(true);
    expect(hasRegexSpecialCharacters("test+pdf")).toBe(true);
  });

  it("通常の文字列の場合はfalseを返す", () => {
    expect(hasRegexSpecialCharacters("jpg")).toBe(false);
    expect(hasRegexSpecialCharacters("pdf")).toBe(false);
    expect(hasRegexSpecialCharacters("txt")).toBe(false);
    expect(hasRegexSpecialCharacters("test-pdf")).toBe(false);
  });
});
