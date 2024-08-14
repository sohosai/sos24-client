"use client";

import { assignType, client } from "@/lib/openapi";
import { NextPage } from "next";
import toast from "react-hot-toast";
import useSWR from "swr";
import {
  CreateFormInput,
  FormEditor,
  FormField,
  HandleFormEditorSubmit,
} from "@/common_components/form_editor/FormEditor";
import { stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/recipes/button";

export const runtime = "edge";

const EditFormPage: NextPage<{ params: { form_id: string } }> = ({ params }) => {
  const router = useRouter();
  const {
    data: previousValuesData,
    error,
    isLoading,
  } = useSWR(() => {
    return `/forms/` + params.form_id;
  });

  const {
    error: answerError,
    data: asnwerData,
    isLoading: answerLoading,
  } = useSWR(`/form-answers?form_id=${params.form_id}`);

  if (answerLoading) {
    return (
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "85vh",
        })}>
        <p>読み込み中...</p>
      </div>
    );
  } else if (answerError && answerError.name !== "form-answer/form-not-found") {
    return (
      <div>
        Error! <p>{JSON.stringify(answerError)}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "85vh",
        })}>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Error! <p>{JSON.stringify(error)}</p>
      </div>
    );
  }

  const previousValues = assignType("/forms/{form_id}", previousValuesData);

  const defaultValues: CreateFormInput = {
    title: previousValues.title,
    description: previousValues.description,
    starts_at: dayjs(previousValues.starts_at).format("YYYY-MM-DDTHH:mm"),
    ends_at: dayjs(previousValues.ends_at).format("YYYY-MM-DDTHH:mm"),
    categories: previousValues.categories,
    attributes: previousValues.attributes,
    attachments: previousValues.attachments,
    items: (previousValues.items as FormField[]).map((item) => {
      const item_clone = JSON.parse(JSON.stringify(item));
      // カンマ区切りを改行に変更する
      if (item.type == "choose_many" || item.type == "choose_one")
        item_clone.options = item_clone.options.toString().replaceAll(",", "\n");
      if (item.type == "file") {
        item_clone.extensions = item_clone.extensions.toString().replaceAll(",", "\n");
      }
      return item_clone;
    }),
  };

  const onSubmit: HandleFormEditorSubmit = async (body) => {
    await toast.promise(
      client
        .PUT(`/forms/{form_id}`, {
          params: {
            path: {
              form_id: params.form_id,
            },
          },
          body,
        })
        .then(({ error }) => {
          if (error) throw error;
        }),
      {
        loading: "申請を更新しています",
        success: () => {
          router.push(`/committee/forms/${params.form_id}`);
          return "申請を更新しました";
        },
        error: "申請の更新に失敗しました",
      },
    );
  };

  return (
    <>
      <div
        className={stack({
          maxWidth: "2xl",
          marginInline: "auto",
          padding: 5,
          gap: 4,
        })}>
        <Link
          href={`/committee/forms/${params.form_id}`}
          className={css({ color: "tsukuba.purple", display: "block" })}>
          ← 申請詳細に戻る
        </Link>
        <h1
          className={css({
            fontSize: "2xl",
            fontWeight: "bold",
          })}>
          申請編集
        </h1>
        <FormEditor
          onSubmit={onSubmit}
          editable={!answerLoading && !answerError && asnwerData.length === 0}
          defaultValues={defaultValues}
        />
        {!(!answerLoading && !answerError && asnwerData.length === 0) && (
          <Link href={`/committee/forms/${params.form_id}`}>
            <Button
              visual="solid"
              color="purple"
              className={css({
                alignSelf: "center",
              })}>
              戻る
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};

export default EditFormPage;
