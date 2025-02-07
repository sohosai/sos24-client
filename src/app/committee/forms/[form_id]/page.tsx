"use client";

import { assignType } from "@/lib/openapi";
import { css, cx } from "@styled-system/css";
import { container, vstack } from "@styled-system/patterns";
import { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";
import { FormDetailedView } from "./FormDetailedView";
import { NotFound } from "@/common_components/NotFound";

const FormDetailedPage: NextPage<{ params: { form_id: string } }> = ({ params }) => {
  const { data: formData, isLoading: formIsLoading, error: formError } = useSWR(`/forms/${params.form_id}`);
  const form = assignType("/forms/{form_id}", formData);
  if (formIsLoading) return;
  if (formError) {
    switch (formError.name) {
      case "form/not-found":
      case "form/invalid-uuid":
        return <NotFound message="申請が見つかりません" />;
      default:
        return "申請の読み込み中にエラーが発生しました";
    }
  }
  return (
    <main className={cx(container({ maxWidth: "4xl", paddingY: 4 }))}>
      <div className={vstack({ gap: 4, alignItems: "start", width: "full" })}>
        <Link href="/committee/forms" className={css({ color: "tsukuba.purple", display: "block" })}>
          ←申請一覧へ
        </Link>
        <FormDetailedView form={form} />
      </div>
    </main>
  );
};

export default FormDetailedPage;
