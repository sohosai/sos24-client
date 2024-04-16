"use client";

import { client } from "@/lib/openapi";
import { css } from "@styled-system/css";
import { stack } from "@styled-system/patterns";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FormEditor, HandleFormEditorSubmit } from "@/common_components/form_editor/FormEditor";

const CreateFormPage: NextPage = () => {
  const router = useRouter();

  const onSubmit: HandleFormEditorSubmit = (body) => {
    client
      .POST("/forms", {
        body,
      })
      .then((res) => {
        if (!res.error) {
          toast.success("申請を作成しました");
          router.push("/committee/forms");
        } else {
          toast.error("申請の作成に失敗しました");
        }
      });
  };

  return (
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
        新規申請作成
      </h1>
      <FormEditor onSubmit={onSubmit} />
    </div>
  );
};

export default CreateFormPage;
