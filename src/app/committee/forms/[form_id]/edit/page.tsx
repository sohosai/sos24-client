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

  if (isLoading) {
    return <div>Loading...</div>;
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
    items: previousValues.items as FormField[],
  };

  const onSubmit: HandleFormEditorSubmit = (body) => {
    toast.promise(
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
          router.push("/committee/forms");
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
        <h1
          className={css({
            fontSize: "2xl",
            fontWeight: "bold",
          })}>
          申請編集
        </h1>
        <FormEditor onSubmit={onSubmit} defaultValues={defaultValues} />
      </div>
    </>
  );
};

export default EditFormPage;
