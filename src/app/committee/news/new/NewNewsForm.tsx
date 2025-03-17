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
import dayjs from "dayjs";

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
    let fileIds: FileIds = {
      attachments: filesStatus.map((fileStatus) => fileStatus.uuid),
    };
    const categories = data.categories === false ? projectCategories : data.categories;
    const starts_at = (data.starts_at === "" ? dayjs() : dayjs(data.starts_at)).toISOString();
    const state = data.starts_at === "" ? "published" : "scheduled";

    await toast.promise(
      client
        .POST("/news", {
          body: {
            title: data.title,
            body: data.body,
            categories: categories as components["schemas"]["ProjectCategory"][],
            attributes: [...projectAttributes] as components["schemas"]["ProjectAttribute"][],
            attachments: fileIds["attachments"] ?? [],
            state: state as components["schemas"]["NewsState"],
            scheduled_at: starts_at,
          },
        })
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }
          // /committee/news/${data.id}に遷移する
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

  const onClick = async (data: NewNewsSchemaType) => {
    let fileIds: FileIds = {
      attachments: filesStatus.map((fileStatus) => fileStatus.uuid),
    };
    const categories = data.categories === false ? projectCategories : data.categories;
    const starts_at = (data.starts_at === "" ? dayjs() : dayjs(data.starts_at)).toISOString();
    const state = "draft";

    await toast.promise(
      client
        .POST("/news", {
          body: {
            title: data.title,
            body: data.body,
            categories: categories as components["schemas"]["ProjectCategory"][],
            attributes: [...projectAttributes] as components["schemas"]["ProjectAttribute"][],
            attachments: fileIds["attachments"] ?? [],
            state: state as components["schemas"]["NewsState"],
            scheduled_at: starts_at,
          },
        })
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }
          // /committee/news/${data.id}に遷移する
          router.push(`/committee/news/${data.id}`);
        }),
      {
        loading: "お知らせの下書きを保存しています",
        error: "下書きの保存中にエラーが発生しました",
        success: "お知らせの下書きを保存しました",
      },
    );
  };

  const onClickHandler = handleSubmit(async (data) => {
    onClick(data);
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
      <div>
        <p
          className={css({
            fontSize: "xs",
            color: "gray.400",
            fontWeight: "bold",
            marginBottom: "5px",
            marginTop: "5px",
          })}>
          投稿日時を選択しなかった場合現在時刻が入力されます
        </p>
        <div>
          <label
            htmlFor="starts_at"
            className={css({
              fontSize: "sm",
              fontWeight: "bold",
              marginRight: "20px",
            })}>
            投稿日時
          </label>
          <input
            type="datetime-local"
            className={css({
              color: "gray.600",
            })}
            id="starts_at"
            {...register("starts_at")}
          />
        </div>
      </div>
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
          type="button"
          color="secondary_blue"
          className={hstack({
            gap: 3,
          })}
          onClick={onClickHandler}
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
