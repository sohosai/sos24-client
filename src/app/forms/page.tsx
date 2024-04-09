"use client";

import { useState } from "react";
import { NextPage } from "next";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";

import { Button } from "@/components/Button";
import { FormsList } from "./FormsList";

const DashboardPage: NextPage = () => {
  const { data: projectRes, error: projectResError, isLoading: projectResIsLoading } = useSWR("/projects/me");
  const project = projectRes ? assignType("/projects/me", projectRes) : undefined;

  const {
    data: formsRes,
    error: formsResError,
    isLoading: formsResIsLoading,
  } = useSWR(() => `/forms?project_id=` + project?.id);
  const forms = formsRes ? assignType("/forms", formsRes) : undefined;

  const {
    data: answersRes,
    error: answersResError,
    isLoading: answersResIsLoading,
  } = useSWR(() => `/form-answers?project_id=` + project?.id);
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
          {(projectResError && !projectResIsLoading) ||
          (formsResError && !formsResIsLoading) ||
          (answersResError && !answersResIsLoading) ? (
            <p>
              フォームの取得中にエラーが発生しました
              <span>({String(projectResError)})</span>
              <span>({String(formsResError)})</span>
              <span>({String(answersResError)})</span>
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
