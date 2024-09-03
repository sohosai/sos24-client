import { hstack, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { Button } from "@/common_components/Button";
import Image from "next/image";
import sendIcon from "@/assets/Send.svg?url";
import { NewNewsSchema, NewNewsSchemaType, projectAttributes, projectCategories } from "@/lib/valibot";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { client } from "@/lib/openapi";
import { components } from "@/schema";
import toast from "react-hot-toast";
import { ProjectCategorySelector } from "@/common_components/ProjectCategorySelector";
import { TitleField } from "@/common_components/news/TitleField";
import { BodyField } from "@/common_components/news/BodyField";
import { useEffect, useState } from "react";
import { FileErrorsType } from "@/common_components/form_answer/FormItems";
import { FilesField } from "@/common_components/form_editor/FilesEditor";
import { filesStatus } from "@/common_components/form_editor/FilesInterfaces";
import pageStyle from "./NewNewsForm.module.scss";

interface NewsProps {
  uid: string;
  title: string;
  body: string;
  categories: string[];
  attachments: string[];
}

export const NewNewsForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<NewNewsSchemaType>({
    mode: "onBlur",
    resolver: valibotResolver(NewNewsSchema),
  });
  const [filesStatus, setFilesStatus] = useState<filesStatus[]>([]);
  const [fileErrors, setFileErrors] = useState<FileErrorsType>(new Map([["attachments", null]]));
  type FileIds = { [itemId: string]: string[] };

  const [drafts, setDrafts] = useState<NewsProps[] | null>(null);
  useEffect(() => {
    const item: string | null = localStorage.getItem("sos_news_drafts");
    if (item) {
      setDrafts(JSON.parse(item) ?? null);
    } else {
      setDrafts(null);
    }
  }, []);
  useEffect(() => {
    if (drafts && drafts.length > 0) {
      console.log("drafts", drafts);
    }
  }, [drafts]);
  const [draftUID, setDraftUID] = useState<string>(Math.random().toString(32).substring(2));
  useEffect(() => {
    console.log(`${draftUID} になりました`);
  }, [draftUID]);

  const onSubmit = async (data: NewNewsSchemaType) => {
    if (fileErrors.get("attachments")) {
      toast.error("添付ファイルを正しく選択してください");
      return;
    }
    let fileIds: FileIds = { attachments: filesStatus.map((fileStatus) => fileStatus.uuid) };
    const categories = data.categories === false ? projectCategories : data.categories;

    await toast.promise(
      client
        .POST("/news", {
          body: {
            title: data.title,
            body: data.body,
            categories: categories as components["schemas"]["ProjectCategory"][],
            attributes: [...projectAttributes] as components["schemas"]["ProjectAttribute"][],
            attachments: fileIds["attachments"] ?? [],
          },
        })
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }
          router.push(`/committee/news/${data.id}`);
        }),
      {
        loading: "お知らせを作成しています",
        error: "お知らせの作成中にエラーが発生しました",
        success: "お知らせを作成しました",
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={stack({ gap: 4 })}>
      <div
        className={hstack({
          justifyContent: "space-between",
          marginBottom: 2,
        })}>
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>新規お知らせ作成</h2>
        <Button
          type="submit"
          color="purple"
          className={hstack({
            gap: 3,
          })}
          disabled={isSubmitting || isSubmitSuccessful}>
          <span
            className={css({
              fontSize: "xs",
              fontWeight: "bold",
            })}>
            送信
          </span>
          <Image src={sendIcon} alt="" />
        </Button>
      </div>
      {drafts && drafts.length > 0 && (
        <div className={pageStyle.draftsWrap}>
          <h3>保存した下書き</h3>
          <select
            value={draftUID}
            onChange={(e) => {
              setDraftUID(e.target.value);
            }}>
            {drafts?.map((draft: NewsProps) => (
              <option key={draft.uid} value={draft.uid}>
                {draft.title}
              </option>
            ))}
          </select>
        </div>
      )}
      <ProjectCategorySelector register={register("categories")} error={errors.categories?.message} />
      <TitleField register={register("title")} error={errors.title?.message} />
      <BodyField register={register("body")} error={errors.body?.message} />
      <FilesField
        label="添付ファイル"
        register={register("attachments")}
        id="attachments"
        filesStatus={filesStatus}
        setFilesStatus={setFilesStatus}
        setErrorState={setFileErrors}
      />
    </form>
  );
};
