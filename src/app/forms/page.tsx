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
import { useAtomValue } from "jotai";
import { hiddenFormIdsAtom } from "./hiddenFormIds";

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

  const hiddenFormIds = useAtomValue(hiddenFormIdsAtom);

  const isLoading = projectResIsLoading || formsResIsLoading || answersResIsLoading;
  const error = projectResError || formsResError || answersResError;

  const [isSubmittedShown, setIsSubmittedShown] = useState(true);
  const [isHiddenFormsShown, setIsHiddenFormsShown] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !forms || !answers) {
    return (
      <p>
        申請の取得中にエラーが発生しました
        <span>({String(projectResError)})</span>
        <span>({String(formsResError)})</span>
        <span>({String(answersResError)})</span>
      </p>
    );
  }

  const notifications = forms.filter(
    (form) => !answers.map((answer) => answer.form_id).includes(form.id) && !hiddenFormIds.includes(form.id),
  ).length;
  const toggleFilter = () => setIsSubmittedShown((prev) => !prev);

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
          <Button color={isSubmittedShown ? "secondary" : "primary"} onClick={toggleFilter} onTouchEnd={toggleFilter}>
            未提出のみ表示
          </Button>
          <FormsList
            forms={forms.filter((form) => !hiddenFormIds.includes(form.id))}
            answers={answers}
            showSubmitted={!isSubmittedShown}
          />

          <button
            className={css({
              fontSize: "lg",
              fontWeight: "bold",
              cursor: "pointer",
            })}
            onClick={() => {
              setIsHiddenFormsShown((prev) => !prev);
            }}>
            {isHiddenFormsShown ? "-" : "+"} 非表示中の申請
          </button>
          {isHiddenFormsShown && (
            <FormsList
              forms={forms.filter((form) => hiddenFormIds.includes(form.id))}
              answers={answers}
              showSubmitted={isSubmittedShown}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
