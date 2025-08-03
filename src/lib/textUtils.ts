import { ProjectAttribute, ProjectCategory } from "./valibot";

export const getProjectCategoryText = (category: ProjectCategory) => {
  switch (category) {
    case "general":
      return "普通企画";
    case "foods_with_kitchen":
      return "調理企画（仕込場必要）";
    case "foods_without_kitchen":
      return "調理企画（仕込場不要）";
    case "foods_without_cooking":
      return "既製食品販売企画";
    case "stage_1a":
      return "ステージ企画（1Aステージ）";
    case "stage_united":
      return "ステージ企画（UNITEDステージ）";
    case "stage_university_hall":
      return "ステージ企画（大学会館ステージ）";
  }
};

export const getProjectAttributeText = (attribute: ProjectAttribute) => {
  switch (attribute) {
    case "academic":
      return "学術参加枠";
    case "art":
      return "芸術祭参加枠";
    case "official":
      return "委員会企画";
    case "inside":
      return "屋内企画";
    case "outside":
      return "屋外企画";
  }
};

/**
 * ファイル拡張子をRegExpで安全に使用するためにエスケープする
 * @param extension ファイル拡張子（例: "jpg", ".jpg", "pdf"）
 * @returns エスケープされた拡張子
 */
export const escapeRegexCharacters = (extension: string): string => {
  // 正規表現の特殊文字をエスケープ
  return extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * ファイル拡張子に正規表現に影響する文字が含まれているかチェック
 * @param extension ファイル拡張子
 * @returns 正規表現に影響する文字が含まれている場合はtrue
 */
export const hasRegexSpecialCharacters = (extension: string): boolean => {
  // ドット以外の正規表現特殊文字をチェック（ドットは拡張子で一般的なので除外）
  return /[*+?^${}()|[\]\\]/.test(extension);
};

/**
 * 複数のファイル拡張子をエスケープして正規表現パターンを作成
 * @param extensions ファイル拡張子の配列
 * @returns 安全な正規表現オブジェクト
 */
export const createSafeExtensionRegex = (extensions: string[]): RegExp => {
  const escapedExtensions = extensions.map(escapeRegexCharacters);
  return new RegExp(`(${escapedExtensions.join("|")})$`, "i");
};
