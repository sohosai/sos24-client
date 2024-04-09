"use client";

import { useState } from "react";
import { NextPage } from "next";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";

import { Button } from "@/components/Button";
import { FormsList } from "./FormsList";
import { stack } from "@styled-system/patterns";
import { NotificationBadge } from "@/components/NotificationBadge";

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

  const isLoading = projectResIsLoading || formsResIsLoading || answersResIsLoading;
  const error = projectResError || formsResError || answersResError;

  const [filterUnsubmitted, setFilterUnsubmitted] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !forms || !answers) {
    return (
      <p>
        フォームの取得中にエラーが発生しました
        <span>({String(projectResError)})</span>
        <span>({String(formsResError)})</span>
        <span>({String(answersResError)})</span>
      </p>
    );
  }

  const notifications = forms.length - answers.length;
  const toggleFilter = () => setFilterUnsubmitted(prev => !prev);

  return (
    <>
      <div
        className={css({
          padding: 5,
          maxWidth: "900px",
          marginInline: "auto",
        })}>
        <div>
          <h2
            className={css({
              fontSize: "xl",
              fontWeight: "bold",
              display: "flex",
              gap: 1,
            })}>
            申請一覧
            {notifications > 0 && <NotificationBadge count={notifications} />}
          </h2>
        </div>
        <div className={stack({ padding: 10, gap: 4, alignItems: "flex-start", width: "100%" })}>
          <Button
            color={filterUnsubmitted ? "primary" : "secondary"}
            onClick={toggleFilter}
            onTouchEnd={toggleFilter}>
            未提出のみ表示
          </Button>
          <FormsList forms={forms} answers={answers} filterUnsubmitted={filterUnsubmitted} />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
