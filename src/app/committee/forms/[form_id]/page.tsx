"use client";

import { Separator } from "@/components/Separator";
import { assignType } from "@/lib/openapi";
import { css, cx } from "@styled-system/css";
import { container, vstack } from "@styled-system/patterns";
import { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";
import { FormDetailedView } from "./FormDetailedView";

export const runtime = "edge";

const FormAnswerList: React.FC<{ formId: string }> = ({ formId }) => {
  const { data, isLoading, error } = useSWR(`/form-answers?form_id=${formId}`);
  const answers = assignType("/form-answers", data);
  if (isLoading) return;
  if (error) return `エラーが発生しました${error}`;
  return <>{answers.map((e) => e.id)}</>;
};

const FormDetailedPage: NextPage<{ params: { form_id: string } }> = ({ params }) => {
  const { data: formData, isLoading, error } = useSWR(`/forms/${params.form_id}`);
  const form = assignType("/forms/{form_id}", formData);
  if (isLoading) return;
  if (error) return "エラーが発生しました";
  return (
    <main className={cx(container({ maxWidth: "4xl", paddingY: 4 }))}>
      <div className={vstack({ gap: 4, alignItems: "start", width: "full" })}>
        <Link href="/committee/forms" className={css({ color: "sohosai.purple", display: "block" })}>
          ←申請一覧へ
        </Link>
        <FormDetailedView form={form} />
        <Separator />
        <FormAnswerList formId={form.id} />
      </div>
    </main>
  );
};

export default FormDetailedPage;
