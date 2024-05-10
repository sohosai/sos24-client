"use client";
import { ProjectCategoryFormatter } from "@/common_components/ProjectCategoryFormatter";
import { projectCategoryItemStyle } from "@/common_components/formFields/styles";
import { projectAttributes, projectCategories } from "@/lib/valibot";
import { components } from "@/schema";
import { css } from "@styled-system/css";
import { hstack, vstack } from "@styled-system/patterns";
import dayjs from "dayjs";
import { LabelAndTime } from "./LabelAndTime";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FilesFormType, FormItems } from "@/common_components/form_answer/FormItems";
import { FormAnswerList } from "./FormAnswerList";
import Image from "next/image";
import deleteNewsButton from "@/assets/deleteFormButton.svg?url";
import { assignType, client } from "@/lib/openapi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AttributesFormatter } from "@/common_components/project/AttributesFormatter";
import { attributeSelectorStyle } from "@/common_components/project/ProjectAttributesBadge";
import { buttonStyle } from "@/recipes/button";
import Link from "next/link";
import useSWR from "swr";
import { FileView } from "@/common_components/FileView";
import { useAuthState } from "@/lib/firebase";
import { handleExport } from "@/lib/export";

const FileViewInstance: React.FC<{ fileId: string }> = ({ fileId }) => {
  const { data, isLoading, error } = useSWR(`/files/${fileId}`);
  const file = assignType("/files/{file_id}", data);
  if (isLoading) return;
  if (error) return `エラーが発生しました ${error}`;
  return <FileView name={file.name} link={file.url} />;
};

export const FormDetailedView: React.FC<{ form: components["schemas"]["Form"] }> = ({ form }) => {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const router = useRouter();
  const [_, setState] = useState<FilesFormType>(new Map());
  const [__, setFileErrors] = useState(new Map());

  const { data, isLoading, error } = useSWR(`/form-answers?form_id=${form.id}`);
  const answers = assignType("/form-answers", data);
  const { user } = useAuthState();
  if (isLoading) return;
  if (error) return `エラーが発生しました${error}`;

  return (
    <div className={vstack({ gap: 4, alignItems: "start", width: "full" })}>
      <div className={hstack({ justifyContent: "space-between", width: "full", flexWrap: "wrap" })}>
        <div>
          作成日: <time dateTime={form.created_at}> {dayjs(form.created_at).format("YYYY/MM/DD")}</time>
        </div>
        <div className={hstack()}>
          <Image
            src={deleteNewsButton}
            alt="delete"
            onClick={() => {
              window.confirm("本当に削除しますか？") &&
                toast.promise(
                  client
                    .DELETE(`/forms/{form_id}`, {
                      params: { path: { form_id: form.id } },
                    })
                    .then(({ error }) => {
                      if (error) throw error;
                    }),
                  {
                    loading: "申請を削除しています",
                    error: "申請削除中にエラーが発生しました",
                    success: () => {
                      router.push("/committee/forms");
                      return "申請を削除しました";
                    },
                  },
                );
            }}
          />
          <Link href={`/committee/forms/${form.id}/edit`} className={buttonStyle({ color: "blue", visual: "outline" })}>
            編集
          </Link>
          <button
            className={buttonStyle({ visual: "outline", color: "purple" })}
            onClick={() =>
              toast.promise(
                handleExport({
                  path: `/form-answers/export?form_id=${form.id}`,
                  fileName: `${form.title}回答一覧.csv`,
                  fileType: "text/csv",
                  user,
                }),
                {
                  loading: "エクスポートしています",
                  success: "エクスポートに成功しました",
                  error: "エクスポートに失敗しました",
                },
              )
            }>
            CSVダウンロード
          </button>
          <button
            className={buttonStyle({ visual: "outline", color: "purple" })}
            onClick={() =>
              toast.promise(
                handleExport({
                  path: `/files/export?form_id=${form.id}`,
                  fileName: `${form.title}ファイル一覧.zip`,
                  fileType: "application/zip",
                  user,
                }),
                {
                  loading: "エクスポートしています",
                  success: "エクスポートに成功しました",
                  error: "エクスポートに失敗しました",
                },
              )
            }>
            ファイルダウンロード
          </button>
        </div>
      </div>
      <div className={hstack({ justifyContent: "space-between", width: "full" })}>
        <h1 className={css({ fontSize: "3xl", fontWeight: "bold", wordBreak: "keep-all" })}>{form.title}</h1>
        <div className={hstack({ flexWrap: "wrap", justifyContent: "flex-end" })}>
          {/* 同じカテゴリが複数入ることはないと信じている */}
          {form.categories.length == projectCategories.length ? (
            <div className={projectCategoryItemStyle}>すべての企画区分</div>
          ) : (
            form.categories.map((category) => (
              <div key={category} className={projectCategoryItemStyle}>
                <ProjectCategoryFormatter category={category} />
              </div>
            ))
          )}
          {form.attributes.length == projectAttributes.length ? (
            <span className={attributeSelectorStyle}>すべての企画属性</span>
          ) : (
            <>
              {form.attributes.map((attribute) => (
                <span key={attribute} className={attributeSelectorStyle}>
                  <AttributesFormatter attribute={attribute} />
                </span>
              ))}
            </>
          )}
        </div>
      </div>
      <div className={css({ width: "full" })}>
        <label className={css({ fontWeight: "bold", fontSize: "lg" })} htmlFor="form-description">
          説明
        </label>
        <textarea
          value={form.description}
          id="form-description"
          disabled
          className={css({ width: "full", borderRadius: "lg", padding: 5 })}
        />
      </div>
      {form.attachments.map((file) => (
        <FileViewInstance fileId={file} key={file} />
      ))}
      <div className={vstack({ gap: 2, alignItems: "start" })}>
        <LabelAndTime label="受付開始日時" time={form.starts_at} />
        <LabelAndTime label="受付終了日時" time={form.ends_at} />
      </div>
      <form
        className={css({
          marginBlock: 10,
          display: "flex",
          flexDirection: "column",
          width: "full",
          rowGap: 3,
        })}>
        <FormItems
          items={form.items}
          getValues={getValues}
          setValue={setValue}
          register={register}
          errors={errors}
          files={new Map()}
          setFiles={setState}
          setFileErrors={setFileErrors}
        />
      </form>
      <FormAnswerList answers={answers} deadline={form.ends_at} />
    </div>
  );
};
