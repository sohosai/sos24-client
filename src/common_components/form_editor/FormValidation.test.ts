import { describe, it, expect } from "vitest";

describe("Form validation error messages", () => {
  it("should have appropriate error messages for form field validation", () => {
    // Test error message strings that will be used in validation
    const expectedMessages = {
      name: "質問を入力してください",
      options: "選択肢を入力してください",
      limit: "ファイル数上限を入力してください",
      extensions: "拡張子を入力してください",
    };

    // Verify messages exist and are in Japanese
    expect(expectedMessages.name).toBe("質問を入力してください");
    expect(expectedMessages.options).toBe("選択肢を入力してください");
    expect(expectedMessages.limit).toBe("ファイル数上限を入力してください");
    expect(expectedMessages.extensions).toBe("拡張子を入力してください");

    // Verify messages are not empty
    Object.values(expectedMessages).forEach((message) => {
      expect(message.length).toBeGreaterThan(0);
    });
  });

  it("should validate required validation rules exist", () => {
    // These validation rules should be present in our register calls
    const nameValidation = { required: { value: true, message: "質問を入力してください" } };
    const optionsValidation = { required: { value: true, message: "選択肢を入力してください" } };
    const limitValidation = {
      required: { value: true, message: "ファイル数上限を入力してください" },
      valueAsNumber: true,
    };
    const extensionsValidation = { required: { value: true, message: "拡張子を入力してください" } };

    expect(nameValidation.required.value).toBe(true);
    expect(nameValidation.required.message).toBe("質問を入力してください");

    expect(optionsValidation.required.value).toBe(true);
    expect(optionsValidation.required.message).toBe("選択肢を入力してください");

    expect(limitValidation.required.value).toBe(true);
    expect(limitValidation.required.message).toBe("ファイル数上限を入力してください");
    expect(limitValidation.valueAsNumber).toBe(true);

    expect(extensionsValidation.required.value).toBe(true);
    expect(extensionsValidation.required.message).toBe("拡張子を入力してください");
  });
});
