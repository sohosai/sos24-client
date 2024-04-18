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
import { FilesField } from "@/common_components/formFields/Files";
import { useState } from "react";
import { FileErrorsType, FilesFormType } from "@/app/forms/[form_id]/FormItems";
import { deleteAllUploadedFiles, postFiles } from "@/lib/postFile";

export const NewNewsForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewNewsSchemaType>({
    mode: "onBlur",
    resolver: valibotResolver(NewNewsSchema),
  });
  const [attachments, setAttachments] = useState<FilesFormType>(new Map([["attachments", null]]));
  const [fileErrors, setFileErrors] = useState<FileErrorsType>(new Map([["attachments", null]]));

  const onSubmit = async (data: NewNewsSchemaType) => {
    if (fileErrors.get("attachments")) {
      toast.error("添付ファイルを正しく選択してください");
      return;
    }
    const fileIds = await postFiles("public", attachments);
    const categories = data.categories.length === 0 ? projectCategories : data.categories;

    client
      .POST("/news", {
        body: {
          title: data.title,
          body: data.body,
          categories: categories as components["schemas"]["ProjectCategory"][],
          attributes: [...projectAttributes] as components["schemas"]["ProjectAttribute"][],
          attachments: fileIds ? fileIds["attachments"] ?? [] : [],
        },
      })
      .then(({ data, error }) => {
        if (error) {
          toast.error(`お知らせ作成中にエラーが発生しました`);
          fileIds && deleteAllUploadedFiles(fileIds);
          return;
        }

        toast.success("お知らせを作成しました");
        router.push(`/committee/news/${data.id}`);
      })
      .catch(() => {
        fileIds && deleteAllUploadedFiles(fileIds);
        toast.error(`お知らせ保存中にエラーが発生しました`);
      });
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
          })}>
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
      <ProjectCategorySelector register={register("categories")} error={errors.categories?.message} />
      <TitleField register={register("title")} error={errors.title?.message} />
      <BodyField register={register("body")} error={errors.body?.message} />
      <FilesField
        id="attachments"
        setFiles={setAttachments}
        setErrorState={setFileErrors}
        label="添付ファイル"
        register={register("attachments")}
      />
    </form>
  );
};
