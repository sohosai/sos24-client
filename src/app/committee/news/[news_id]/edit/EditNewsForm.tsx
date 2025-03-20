import { useForm } from "react-hook-form";
import { projectAttributes, projectCategories, UpdateNewsSchema, UpdateNewsSchemaType } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { center, hstack, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { Button } from "@/common_components/Button";
import Image from "next/image";
import sendIcon from "@/assets/Send.svg?url";
import useSWR from "swr";
import { assignType, client } from "@/lib/openapi";
import { FC, useState } from "react";
import { components } from "@/schema";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ProjectCategorySelector } from "@/common_components/ProjectCategorySelector";
import { TitleField } from "@/common_components/news/TitleField";
import { BodyField } from "@/common_components/news/BodyField";
import { FilesField } from "@/common_components/form_editor/FilesEditor";
import { filesStatus } from "@/common_components/form_editor/FilesInterfaces";
import { FileErrorsType } from "@/common_components/form_answer/FormItems";
import driveIcon from "@/assets/Drive.svg?url";
import dayjs from "dayjs";

export const EditNewsForm: FC<{
  news_id: string;
}> = ({ news_id }) => {
  const router = useRouter();
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<UpdateNewsSchemaType>({
    mode: "onBlur",
    resolver: valibotResolver(UpdateNewsSchema),
  });

  const [filesStatus, setFilesStatus] = useState<filesStatus[]>([]);
  const [fileErrors, setFileErrors] = useState<FileErrorsType>(new Map([["attachments", null]]));
  type FileIds = { [itemId: string]: string[] };

  const { data: data_user, isLoading: isLoading_user } = useSWR("/users/me");
  const me = assignType("/users/me", data_user);

  const { data, error, isLoading, mutate } = useSWR(`/news/${news_id}`);
  if (isLoading) {
    return;
  }
  if (error) {
    switch (error.name) {
      case "news/not-found":
        return <p>このお知らせは存在しません。</p>;
      default:
        return <p>お知らせの読み込み中に不明なエラーが発生しました。</p>;
    }
  }

  const news = assignType("/news/{news_id}", data);
  const isPublished = news.state === "published" ? true : false;

  if (!isFormInitialized) {
    setIsFormInitialized(true);
    const fileDatas =
      news.attachments.map((uuid) => ({
        name: null,
        uuid: uuid,
        uploaded: true,
      })) ?? [];
    setFilesStatus(fileDatas);
    reset({
      title: news.title,
      body: news.body,
      categories: news.categories,
      starts_at: news.scheduled_at != null ? dayjs(news.scheduled_at).format("YYYY-MM-DDTHH:ss") : undefined,
    });
  }

  const onSubmit = async (data: UpdateNewsSchemaType) => {
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
        .PUT(`/news/{news_id}`, {
          params: { path: { news_id: news_id } },
          body: {
            title: data.title,
            state: state as components["schemas"]["NewsState"],
            body: data.body,
            categories: categories as components["schemas"]["ProjectCategory"][],
            attributes: [...projectAttributes] as components["schemas"]["ProjectAttribute"][],
            attachments: fileIds["attachments"] ?? [],
            scheduled_at: starts_at as components["schemas"]["CreateNews"]["scheduled_at"],
          },
        })
        .then(({ error }) => {
          if (error) {
            throw error;
          }
          mutate();
          router.push(`/committee/news/${news_id}`);
        }),
      {
        loading: "お知らせを保存しています",
        error: () => {
          return "お知らせの保存中にエラーが発生しました";
        },
        success: "お知らせを保存しました",
      },
    );
  };
  const onClick = async (data: UpdateNewsSchemaType) => {
    let fileIds: FileIds = { attachments: filesStatus.map((fileStatus) => fileStatus.uuid) };
    const categories = data.categories === false ? projectCategories : data.categories;
    const starts_at = (data.starts_at === "" ? dayjs() : dayjs(data.starts_at)).toISOString();
    const state = "draft";

    await toast.promise(
      client
        .PUT(`/news/{news_id}`, {
          params: { path: { news_id: news_id } },
          body: {
            title: data.title,
            state: state as components["schemas"]["NewsState"],
            body: data.body,
            categories: categories as components["schemas"]["ProjectCategory"][],
            attributes: [...projectAttributes] as components["schemas"]["ProjectAttribute"][],
            attachments: fileIds["attachments"] ?? [],
            scheduled_at: starts_at as components["schemas"]["CreateNews"]["scheduled_at"],
          },
        })
        .then(({ error }) => {
          if (error) {
            throw error;
          }
          mutate();
          router.push(`/committee/news/${news_id}`);
        }),
      {
        loading: "お知らせの下書きを更新しています",
        error: () => {
          return "下書きの更新中にエラーが発生しました";
        },
        success: "お知らせの下書きを更新しました",
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
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>お知らせ編集</h2>
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

      {!isPublished && (
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
      )}

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
          onClick={handleSubmit(onClick)}
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
            保存
          </span>
          <Image src={sendIcon} alt="" />
        </Button>
      </div>
      <div className={center()}>
        {!isLoading_user && ["committee_operator", "administrator"].includes(me.role) && (
          <Button
            color="secondary"
            className={css({ w: "269px" })}
            onClick={() => {
              window.confirm("本当に削除しますか？") &&
                toast.promise(
                  client
                    .DELETE(`/news/{news_id}`, {
                      params: { path: { news_id: news_id } },
                    })
                    .then(({ error }) => {
                      if (error) {
                        throw error;
                      }
                      router.push(`/committee/news`);
                    }),
                  {
                    loading: "お知らせを削除しています",
                    error: "お知らせの削除中にエラーが発生しました",
                    success: "お知らせを削除しました",
                  },
                );
            }}>
            お知らせを削除する
          </Button>
        )}
      </div>
    </form>
  );
};
