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
  const { data: projectRes, error: projectError } = useSWR("/projects/me", fetcherWithToken);
  const project = projectRes ? assignType("/projects/me", projectRes.json) : undefined;

  const projectId = project?.id;
  const {
    data: formsRes,
    error: formsError,
    isLoading: formsLoading,
  } = useSWR(`/forms?project_id=${projectId}`, fetcherWithToken);
  const forms = formsRes ? assignType("/forms", formsRes) : undefined;

  const {
    data: answersRes,
    error: answersError,
    isLoading: answersLoading,
  } = useSWR(`/form-answers?project_id=${projectId}`, fetcherWithToken);
  const answers = answersRes ? assignType("/form-answers", answersRes) : undefined;

  const notification = forms && answers ? forms.length - answers.length : 0;

  const [filterUnsubmitted, setFilterUnsubmitted] = useState(false);

  const notificationStyle = css({
    _after: {
      content: `"${notification}"`,
      display: "inline-block",
      position: "relative",
      top: -5,
      backgroundColor: "red.500",
      color: "white",
      height: 7,
      width: 7,
      textAlign: "center",
      verticalAlign: "middle",
      fontWeight: "bold",
      borderRadius: "50%",
    },
  });
  if (formsLoading || answersLoading) return;
  return (
    <>
      <div
        className={css({
          padding: 5,
        })}>
        <h2 className={notification >= 1 ? notificationStyle : ""}>申請一覧</h2>

        <div
          className={css({
            maxWidth: "900px",
            marginInline: "auto",
          })}>
          {projectError || formsError || answersError ? (
            <p>
              フォームの取得中にエラーが発生しました(
              {(projectError ? `Project: ${projectRes?.statusCode} ` : "") +
                (formsError ? `Forms: ${formsRes?.statusCode} ` : "") +
                (answersError ? `Answers: ${answersRes?.statusCode}` : "")}
              )
            </p>
          ) : (
            <>
              <Button
                color={filterUnsubmitted ? "primary" : "secondary"}
                onClick={() => setFilterUnsubmitted(!filterUnsubmitted)}
                onTouchEnd={() => setFilterUnsubmitted(!filterUnsubmitted)}>
                未提出のみ表示
              </Button>
              <FormsList forms={forms} answers={answers} filterUnsubmitted={filterUnsubmitted} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
