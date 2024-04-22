"use client";
import useSWR from "swr";
import { NextPage } from "next";
import { assignType } from "@/lib/openapi";

import { FormPage } from "@/common_components/form_answer/FormPage";

export const runtime = "edge";

const FormAnswerPage: NextPage<{ params: { answer_id: string } }> = ({ params }) => {
  const id = params.answer_id;

  const { data: answerRes, error: answerError, isLoading: answerLoading } = useSWR(`/form-answers/${id}`);
  const answer = answerRes ? assignType("/form-answers/{form_answer_id}", answerRes) : undefined;

  const {
    data: formRes,
    error: formError,
    isLoading: formLoading,
  } = useSWR(answer?.form_id ? `/forms/${answer.form_id}` : null);
  const form = formRes ? assignType("/forms/{form_id}", formRes) : undefined;

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

export default FormAnswerPage;
