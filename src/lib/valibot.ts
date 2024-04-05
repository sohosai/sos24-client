import { custom, literal, minLength, object, Output, string, union } from "valibot";

/**
 * 半角・全角英数字及び半角記号を3文字でかな2文字分としてカウントする謎のやつ
 * ref: https://github.com/sohosai/sos-frontend/blob/dev/src/utils/awesomeCharacterCount.ts
 */
const awesomeCharacterCount = (string: string): number => {
  const notSpecialCharactersPattern = /[^\u0021-\u007e\uff10-\uff19\uff21-\uff3a\uff41-\uff5a]/g;
  const specialCharacters = string.replace(notSpecialCharactersPattern, "");
  return string.length - specialCharacters.length / 3;
};

const containsEmoji = (string: string): boolean => {
  return /\p{Extended_Pictographic}/u.test(string);
};

const projectTitleSchema = string([
  minLength(1, "1文字以上で入力してください"),
  custom((value) => awesomeCharacterCount(value) <= 20, "20文字以内で入力してください"),
  custom((value) => !containsEmoji(value), "絵文字は使用できません"),
]);

/**
 * @returns boolean: true if `str` is empty string
 */
const isHiragana = (str: string): boolean => {
  return /^[\u3040-\u309F\s]*$/.test(str);
};

const projectKanaTitleSchema = string([
  minLength(1, "1文字以上で入力してください"),
  custom((value) => isHiragana(value), "ひらがなで入力してください"),
]);

const projectGroupName = string([
  minLength(1, "1文字以上で入力してください"),
  custom((value) => awesomeCharacterCount(value) <= 20, "20文字以内で入力してください"),
  custom((value) => !containsEmoji(value), "絵文字は使用できません"),
]);

const projectKanaGroupName = string([
  minLength(1, "1文字以上で入力してください"),
  custom((value) => isHiragana(value), "ひらがなで入力してください"),
]);

export const projectCategories = [
  "general",
  "foods_with_kitchen",
  "foods_without_kitchen",
  "foods_without_cooking",
  "stage_1a",
  "stage_university_hall",
  "stage_united",
];
export type ProjectCategory = (typeof projectCategories)[number];

const projectCategorySchema = union(
  projectCategories.map((it) => literal(it)),
  "いずれかの企画区分を選択してください",
);

export const projectPlaces = ["outside", "inside", "stage"];
export type ProjectPlace = (typeof projectPlaces)[number];

const projectPlaceSchema = union(
  projectPlaces.map((it) => literal(it)),
  "いずれかの企画実施場所を選択してください",
);

const projectAgreementSchema = literal(true, "同意が必要です");

export const RegisterProjectSchema = object({
  title: projectTitleSchema,
  kana_title: projectKanaTitleSchema,
  group_name: projectGroupName,
  kana_group_name: projectKanaGroupName,
  category: projectCategorySchema,
  place: projectPlaceSchema,
  agreement1: projectAgreementSchema,
  agreement2: projectAgreementSchema,
});

export type RegisterProjectSchemaType = Output<typeof RegisterProjectSchema>;
