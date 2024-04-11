"use client";

import { getProjectAttributeText, getProjectCategoryText } from "@/lib/textUtils";
import { projectAttributes, projectCategories } from "@/lib/valibot";
import { css } from "@styled-system/css";
import { stack, visuallyHidden } from "@styled-system/patterns";
import { NextPage } from "next";
import { FC } from "react";
import { useForm } from "react-hook-form";

const sectionTitleStyle = css({
  fontSize: "xl",
  fontWeight: "bold",
});

const descriptionStyle = css({
  fontSize: "sm",
  color: "gray.600",
});

const checkboxStyle = css({
  py: 1,
  px: 4,
  rounded: "full",
  background: "gray.200",
  color: "gray.500",
  fontSize: "sm",
  fontWeight: "bold",
  "&:has(:checked)": {
    background: "tsukuba.purple",
    color: "white",
  },
});

const checkboxGrpupStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
});

const textInputStyle = css({
  border: "1px solid token(colors.gray.400)",
  background: "gray.100",
  rounded: "sm",
  width: "full",
  padding: 2,
});

const Divider: FC = () => {
  return <div className={css({ width: "full", height: "2px", background: "gray.400" })}></div>;
};

const CreateFormPage: NextPage = () => {
  const { register } = useForm();

  return (
    <div
      className={stack({
        maxWidth: "2xl",
        marginInline: "auto",
        padding: 5,
        gap: 4,
      })}>
      <h1
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
        })}>
        新規申請作成
      </h1>
      <Divider />
      <form className={stack({ gap: 4 })}>
        <fieldset
          className={stack({
            gap: 5,
          })}>
          <legend className={sectionTitleStyle}>送信先絞り込み</legend>
          <p className={descriptionStyle}>選択しない場合全ての企画が対象になります</p>
          <div className={stack({ gap: 2 })}>
            <label>企画区分</label>
            <div className={checkboxGrpupStyle}>
              {projectCategories.map((category) => (
                <label key={category} className={checkboxStyle}>
                  <input type="checkbox" className={visuallyHidden()} />
                  {getProjectCategoryText(category)}
                </label>
              ))}
            </div>
          </div>

          <div className={stack({ gap: 2 })}>
            <label>企画属性</label>
            <div className={checkboxGrpupStyle}>
              {projectAttributes.map((attribute) => (
                <label key={attribute} className={checkboxStyle}>
                  <input type="checkbox" className={visuallyHidden()} />
                  {getProjectAttributeText(attribute)}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <Divider />

        <div className={stack({ gap: 4 })}>
          <div>
            <label htmlFor="title">タイトル</label>
            <input {...register("title")} className={textInputStyle} />
          </div>
          <div>
            <label htmlFor="description">説明</label>
            <textarea {...register("description")} className={textInputStyle} />
          </div>
          <div>
            <label htmlFor="attachments">添付ファイル</label>
          </div>
          <div>
            <p className={descriptionStyle}>受付開始日時を選択しなかった場合現在時刻が入力されます</p>
            <div>
              <label>受付開始日時</label>
              <input type="date" />
            </div>
            <div>
              <label>受付終了日時</label>
              <input type="date" />
            </div>
          </div>
        </div>

        <Divider />

        <fieldset>
          <legend>質問項目</legend>
          <div>
            <button>テキスト項目</button>
            <button>チェックボックス項目</button>
            <button>ドロップダウン項目</button>
            <button>ファイル項目</button>
          </div>
        </fieldset>

        <button>送信</button>
      </form>
    </div>
  );
};

export default CreateFormPage;
