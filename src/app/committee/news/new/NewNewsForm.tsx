import { hstack, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { Button } from "@/common_components/Button";
import Image from "next/image";
import sendIcon from "@/assets/Send.svg?url";
import driveIcon from "@/assets/Drive.svg?url";
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
import { useState } from "react";
import { FileErrorsType } from "@/common_components/form_answer/FormItems";
import { FilesField } from "@/common_components/form_editor/FilesEditor";
import { filesStatus } from "@/common_components/form_editor/FilesInterfaces";

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

  const onSubmitHandler = handleSubmit(async (data) => {
    onSubmit(data);
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!window.confirm("この内容で送信しますか？")) {
          toast("送信をキャンセルしました");
          return;
        } else {
          return onSubmitHandler();
        }
      }}
      className={stack({ gap: 4 })}>
      <div
        className={hstack({
          justifyContent: "space-between",
          marginBottom: 2,
        })}>
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>新規お知らせ作成</h2>
      </div>
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
      <div
        className={hstack({
          justifyContent: "space-between",
          marginBottom: 2,
          alignSelf: "center",
          display: "flex",
          alignItems: "center",
          gap: 1,
        })}>
        <Button
          type="button "
          color="secondary_blue"
          className={hstack({
            gap: 3,
          })}
          onClick={() => {
            //下書き保存
          }}
          disabled={isSubmitting || isSubmitSuccessful}>
          <span
            className={css({
              fontSize: "xs",
              fontWeight: "bold",
            })}>
            下書き保存
          </span>
          <Image src={driveIcon} alt="" />
        </Button>
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
    </form>
  );
};
