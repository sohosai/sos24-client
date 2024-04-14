import { array, custom, literal, minLength, object, Output, regex, string, union } from "valibot";
import Graphemer from "graphemer";

/**
 * 半角・全角英数字及び半角記号を3文字でかな2文字分としてカウントする謎のやつ
 * ref: https://github.com/sohosai/sos-frontend/blob/dev/src/utils/awesomeCharacterCount.ts
 */
const awesomeCharacterCount = (string: string): number => {
  const notSpecialCharactersPattern = /[^\u0021-\u007e\uff10-\uff19\uff21-\uff3a\uff41-\uff5a]/g;
  const specialCharacters = string.replace(notSpecialCharactersPattern, "");
  return string.length - specialCharacters.length / 3;
};

const containsEmoji = (string: string) => {
  const splitter = new Graphemer();
  const graphemes = splitter.splitGraphemes(string);
  for (const grapheme of graphemes) {
    if (!/[\u{0023}-\u{0039}]$/u.test(grapheme) && /\p{Emoji}/u.test(grapheme)) {
      return true;
    }
  }
  return false;
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
] as const;
export type ProjectCategory = (typeof projectCategories)[number];

const projectCategorySchema = union(
  projectCategories.map((it) => literal(it)),
  "いずれかの企画区分を選択してください",
);

export const projectAttributes = ["academic", "art", "official", "inside", "outside"] as const;
export type ProjectAttribute = (typeof projectAttributes)[number];

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

export const UpdateProjectSchema = object({
  title: projectTitleSchema,
  kana_title: projectKanaTitleSchema,
  group_name: projectGroupName,
  kana_group_name: projectKanaGroupName,
});

export type UpdateProjectSchemaType = Output<typeof UpdateProjectSchema>;

const userNameSchema = string([minLength(1, "名前を入力してください")]);

const userKanaNameSchema = string([
  minLength(1, "名前のふりがなを入力してください"),
  regex(/^[ぁ-んー－゛゜]+$/, "ひらがなで入力してください"),
]);

const userEmailSchema = string([
  minLength(1, "メールアドレスを入力してください"),
  regex(/.*@.*\.tsukuba\.ac\.jp$/, "筑波大学のメールアドレスを入力してください"),
]);

const userPasswordSchema = string([minLength(1, "パスワードを入力してください")]);

const userPhoneNumberSchema = string([minLength(1, "電話番号を入力してください")]);

const userAgreementSchema = literal(true, "利用規約に同意してください");

export const SignupSchema = object({
  name: userNameSchema,
  kana_name: userKanaNameSchema,
  phone_number: userPhoneNumberSchema,
  email: userEmailSchema,
  password: userPasswordSchema,
  agreement: userAgreementSchema,
});

export type SignupSchemaType = Output<typeof SignupSchema>;

export const userRoles = ["administrator", "committee_operator", "committee", "general"];
export type UserRole = (typeof userRoles)[number];

const userRoleSchema = union(
  userRoles.map((it) => literal(it)),
  "いずれかの権限を選択してください",
);

export const UpdateUserSchema = object({
  name: userNameSchema,
  kana_name: userKanaNameSchema,
  email: userEmailSchema,
  phone_number: userPhoneNumberSchema,
  role: userRoleSchema,
});

export type UpdateUserSchemaType = Output<typeof UpdateUserSchema>;
const newsTitleSchema = string([minLength(1, "1文字以上で入力してください")]);

const newsBodySchema = string([minLength(1, "1文字以上で入力してください")]);

const newsCategories = array(projectCategorySchema);

export const NewNewsSchema = object({
  title: newsTitleSchema,
  body: newsBodySchema,
  categories: newsCategories,
});

export type NewNewsSchemaType = Output<typeof NewNewsSchema>;

export const UpdateNewsSchema = object({
  title: newsTitleSchema,
  body: newsBodySchema,
  categories: newsCategories,
});

export type UpdateNewsSchemaType = Output<typeof UpdateNewsSchema>;
