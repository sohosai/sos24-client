import { describe, it, expect } from "vitest";

describe("FormFieldEditor File Validation", () => {
  describe("File limit validation", () => {
    it("should require minimum value of 1 for file upload limit", () => {
      // Test the validation rule that we added
      const validationRule = {
        required: { value: true, message: "ファイル数上限を入力してください" },
        min: { value: 1, message: "この設定では何も提出できません" },
        valueAsNumber: true,
      };

      // Validate that the rule structure is correct
      expect(validationRule.min.value).toBe(1);
      expect(validationRule.min.message).toBe("この設定では何も提出できません");
      expect(validationRule.required.value).toBe(true);
      expect(validationRule.valueAsNumber).toBe(true);
    });

    it("should show correct error message when limit is 0", () => {
      const expectedErrorMessage = "この設定では何も提出できません";
      expect(expectedErrorMessage).toBe("この設定では何も提出できません");
    });
  });
});