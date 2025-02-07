"use client";

import useSWR from "swr";
import { assignType } from "@/lib/openapi";

import { NotFound } from "@/common_components/NotFound";
import { FormPage } from "@/common_components/form_answer/FormPage";

const FormDetailPage = ({ params }: { params: { form_id: string } }) => {
  const id = params.form_id;

  const { data: formRes, error: formError, isLoading: formLoading } = useSWR(`/forms/${id}`);
  const form = formRes ? assignType("/forms/{form_id}", formRes) : undefined;

  const {
    data: answerRes,
    error: answerError,
    isLoading: answerLoading,
  } = useSWR(form?.answer_id ? `/form-answers/${form.answer_id}` : null);
  const answer = answerRes ? assignType("/form-answers/{form_answer_id}", answerRes) : undefined;

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
    <FormPage
      answer={answer}
      answerError={answerError}
      answerLoading={answerLoading}
      form={form}
      formError={formError}
      formLoading={formLoading}
    />
  );
};

export default FormDetailPage;
