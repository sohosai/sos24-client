import { describe, it, expect } from "vitest";
import { escapeRegexCharacters, hasRegexSpecialCharacters, createSafeExtensionRegex } from "./textUtils";

describe("escapeRegexCharacters", () => {
  it("ドットをエスケープする", () => {
    expect(escapeRegexCharacters(".jpg")).toBe("\\.jpg");
    expect(escapeRegexCharacters("file.txt")).toBe("file\\.txt");
  });

  it("アスタリスクをエスケープする", () => {
    expect(escapeRegexCharacters("*.jpg")).toBe("\\*\\.jpg");
  });

  it("プラス記号をエスケープする", () => {
    expect(escapeRegexCharacters("test+.pdf")).toBe("test\\+\\.pdf");
  });

  it("疑問符をエスケープする", () => {
    expect(escapeRegexCharacters("file?.txt")).toBe("file\\?\\.txt");
  });

  it("キャレットをエスケープする", () => {
    expect(escapeRegexCharacters("^test.jpg")).toBe("\\^test\\.jpg");
  });

  it("ドル記号をエスケープする", () => {
    expect(escapeRegexCharacters("test$.pdf")).toBe("test\\$\\.pdf");
  });

  it("波括弧をエスケープする", () => {
    expect(escapeRegexCharacters("{test}.jpg")).toBe("\\{test\\}\\.jpg");
  });

  it("角括弧をエスケープする", () => {
    expect(escapeRegexCharacters("[test].pdf")).toBe("\\[test\\]\\.pdf");
  });

  it("パイプをエスケープする", () => {
    expect(escapeRegexCharacters("test|file.jpg")).toBe("test\\|file\\.jpg");
  });

  it("バックスラッシュをエスケープする", () => {
    expect(escapeRegexCharacters("test\\file.pdf")).toBe("test\\\\file\\.pdf");
  });

  it("通常の文字列はそのまま返す", () => {
    expect(escapeRegexCharacters("jpg")).toBe("jpg");
    expect(escapeRegexCharacters("pdf")).toBe("pdf");
    expect(escapeRegexCharacters("test")).toBe("test");
  });

  it("複数の特殊文字を含む文字列を正しくエスケープする", () => {
    expect(escapeRegexCharacters(".*+?^${}()|[]\\")).toBe("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\");
  });
});

describe("hasRegexSpecialCharacters", () => {
  it("ドット以外の特殊文字が含まれている場合はtrueを返す", () => {
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
  });

  it("ドットのみの場合はfalseを返す（拡張子では一般的なため）", () => {
    expect(hasRegexSpecialCharacters(".")).toBe(false);
    expect(hasRegexSpecialCharacters(".jpg")).toBe(false);
    expect(hasRegexSpecialCharacters("file.txt")).toBe(false);
  });

  it("通常の文字列の場合はfalseを返す", () => {
    expect(hasRegexSpecialCharacters("jpg")).toBe(false);
    expect(hasRegexSpecialCharacters("pdf")).toBe(false);
    expect(hasRegexSpecialCharacters("txt")).toBe(false);
  });

  it("特殊文字とドットが混在している場合はtrueを返す", () => {
    expect(hasRegexSpecialCharacters("*.jpg")).toBe(true);
    expect(hasRegexSpecialCharacters("test+.pdf")).toBe(true);
  });
});

describe("createSafeExtensionRegex", () => {
  it("通常の拡張子で正しい正規表現を作成する", () => {
    const regex = createSafeExtensionRegex(["jpg", "png", "gif"]);
    expect(regex.test("image.jpg")).toBe(true);
    expect(regex.test("image.png")).toBe(true);
    expect(regex.test("image.gif")).toBe(true);
    expect(regex.test("image.bmp")).toBe(false);
  });

  it("ドットを含む拡張子で正しい正規表現を作成する", () => {
    const regex = createSafeExtensionRegex([".jpg", ".png"]);
    expect(regex.test("image.jpg")).toBe(true);
    expect(regex.test("image.png")).toBe(true);
    expect(regex.test("imagejpg")).toBe(false); // ドットがエスケープされているため一致しない
  });

  it("特殊文字を含む拡張子で安全な正規表現を作成する", () => {
    const regex = createSafeExtensionRegex(["*", "+", "?"]);
    expect(regex.test("file*")).toBe(true);
    expect(regex.test("file+")).toBe(true);
    expect(regex.test("file?")).toBe(true);
    expect(regex.test("filea")).toBe(false); // * が任意の文字にマッチしないことを確認
  });

  it("大文字小文字を区別しない", () => {
    const regex = createSafeExtensionRegex(["jpg"]);
    expect(regex.test("image.JPG")).toBe(true);
    expect(regex.test("image.Jpg")).toBe(true);
    expect(regex.test("image.jpg")).toBe(true);
  });

  it("末尾のマッチのみを検証する", () => {
    const regex = createSafeExtensionRegex(["jpg"]);
    expect(regex.test("jpgfile.txt")).toBe(false);
    expect(regex.test("file.jpg")).toBe(true);
  });
});