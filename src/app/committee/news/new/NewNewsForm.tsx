import { hstack, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { Button } from "@/components/Button";
import Image from "next/image";
import sendIcon from "@/components/assets/Send.svg";
import { NewNewsSchema, NewNewsSchemaType, projectAttributes, projectCategories } from "@/lib/valibot";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { client } from "@/lib/openapi";
import { components } from "@/schema";
import toast from "react-hot-toast";
import { ProjectCategorySelector } from "@/components/ProjectCategorySelector";
import { TitleField } from "@/components/news/TitleField";
import { BodyField } from "@/components/news/BodyField";
import { Heading } from "@/components/Heading";

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

  const onSubmit = async (data: NewNewsSchemaType) => {
    const categories = data.categories.length === 0 ? projectCategories : data.categories;
    client
      .POST("/news", {
        body: {
          title: data.title,
          body: data.body,
          categories: categories as components["schemas"]["ProjectCategory"][],
          attributes: projectAttributes as components["schemas"]["ProjectAttribute"][],
          attachments: [],
        },
      })
      .then(({ data, error }) => {
        if (error) {
          toast.error(`お知らせ作成中にエラーが発生しました`);
          return;
        }

        toast.success("お知らせを作成しました");
        router.push(`/committee/news/${data.id}`);
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
          color="primary"
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
      <Heading>添付ファイル</Heading>
    </form>
  );
};
