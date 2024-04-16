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
import { Heading } from "@/common_components/Heading";

export const EditNewsForm: FC<{
  news_id: string;
}> = ({ news_id }) => {
  const router = useRouter();
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateNewsSchemaType>({
    mode: "onBlur",
    resolver: valibotResolver(UpdateNewsSchema),
  });

  const { data, error, isLoading } = useSWR(`/news/${news_id}`);
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

  if (!isFormInitialized) {
    setIsFormInitialized(true);
    reset({
      title: news.title,
      body: news.body,
      categories: news.categories,
    });
  }

  const onSubmit = async (data: UpdateNewsSchemaType) => {
    const categories = data.categories.length === 0 ? projectCategories : data.categories;
    client
      .PUT(`/news/{news_id}`, {
        params: { path: { news_id: news_id } },
        body: {
          title: data.title,
          body: data.body,
          categories: categories as components["schemas"]["ProjectCategory"][],
          attributes: [...projectAttributes] as components["schemas"]["ProjectAttribute"][],
          attachments: [],
        },
      })
      .then(({ error }) => {
        if (error) {
          toast.error(`お知らせ保存中にエラーが発生しました`);
          return;
        }

        toast.success("お知らせを保存しました");
        router.push(`/committee/news/${news_id}`);
      })
      .catch(() => {
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
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>お知らせ編集</h2>
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
            保存
          </span>
          <Image src={sendIcon} alt="" />
        </Button>
      </div>
      <ProjectCategorySelector register={register("categories")} error={errors.categories?.message} />
      <TitleField register={register("title")} error={errors.title?.message} />
      <BodyField register={register("body")} error={errors.body?.message} />
      <Heading>添付ファイル</Heading>
      <div className={center()}>
        <Button
          color="secondary"
          className={css({ w: "269px" })}
          onClick={() => {
            window.confirm("本当に削除しますか？") &&
              client
                .DELETE(`/news/{news_id}`, {
                  params: { path: { news_id: news_id } },
                })
                .then(({ error }) => {
                  if (error) {
                    toast.error(`お知らせ削除中にエラーが発生しました`);
                    return;
                  }
                  toast.success("お知らせを削除しました");
                  router.push(`/committee/news`);
                })
                .catch(() => {
                  toast.error(`お知らせ削除中にエラーが発生しました`);
                });
          }}>
          お知らせを削除する
        </Button>
      </div>
    </form>
  );
};
