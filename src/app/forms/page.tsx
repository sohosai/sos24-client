"use client";

import { useState } from "react";
import { NextPage } from "next";
import useSWR from "swr";
import { fetcherWithToken } from "@/lib/swr";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";

import { Button } from "@/components/Button";
import { FormsList } from "./FormsList";

const DashboardPage: NextPage = () => {
  const { data: projectRes, error: projectErr } = useSWR("/projects/me", fetcherWithToken);
  const project = projectRes ? assignType("/projects/me", projectRes) : undefined;

  const projectId = project?.id;
  const { data: formsRes, error: formsErr } = useSWR(`/forms?project_id=${projectId}`, fetcherWithToken);
  const forms = formsRes ? assignType("/forms", formsRes) : undefined;

  const { data: answersRes, error: answersErr } = useSWR(`/form-answers?project_id=${projectId}`, fetcherWithToken);
  const answers = answersRes ? assignType("/form-answers", answersRes) : undefined;

  const [filterUnsubmitted, setFilterUnsubmitted] = useState(false);

  return (
    <>
      <div
        className={css({
          padding: 5,
        })}>
        <h2>申請一覧</h2>

        <div
          className={css({
            maxWidth: "900px",
            marginInline: "auto",
          })}>
          <Button
            color={filterUnsubmitted ? "primary" : "secondary"}
            onClick={() => setFilterUnsubmitted(!filterUnsubmitted)}
            onTouchEnd={() => setFilterUnsubmitted(!filterUnsubmitted)}>
            未提出のみ表示
          </Button>
          {projectErr || formsErr || answersErr ? (
            <p>
              フォームの取得中にエラーが発生しました(
              {(projectErr ? `Project: ${projectErr}` : "") +
                (formsErr ? `Forms: ${formsErr}` : "") +
                (answersErr ? `Answers: ${answersErr}` : "")}
              )
            </p>
          ) : (
            <FormsList forms={forms} answers={answers} filterUnsubmitted={filterUnsubmitted} />
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
