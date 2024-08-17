"use client";

import { client } from "@/lib/openapi";
import { css } from "@styled-system/css";
import { stack } from "@styled-system/patterns";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FormEditor, HandleFormEditorSubmit } from "@/common_components/form_editor/FormEditor";
import { deleteMultipleUploadedFiles } from "@/lib/postFile";
import Link from "next/link";

const CreateFormPage: NextPage = () => {
  const router = useRouter();

  const onSubmit: HandleFormEditorSubmit = async (body) => {
    await toast.promise(
      client
        .POST("/forms", {
          body,
        })
        .then(({ error }) => {
          if (error) throw error;
        }),
      {
        loading: "申請を作成しています",
        error: () => {
          deleteMultipleUploadedFiles(body.attachments);
          return "申請を作成できませんでした";
        },
        success: () => {
          router.push("/committee/forms");
          return "申請を作成しました";
        },
      },
    );
  };

  return (
    <div
      className={stack({
        maxWidth: "2xl",
        marginInline: "auto",
        padding: 5,
        gap: 4,
      })}>
      {" "}
      <Link href={`/committee/forms`} className={css({ color: "tsukuba.purple", display: "block" })}>
        ← 申請一覧に戻る
      </Link>
      <h1
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
        })}>
        新規申請作成
      </h1>
      <FormEditor onSubmit={onSubmit} editable={true} />
    </div>
  );
};

export default CreateFormPage;
