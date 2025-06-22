"use client";

import { useState } from "react";
import { NextPage } from "next";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";
import { container, stack } from "@styled-system/patterns";
import { NotificationBadge } from "@/common_components/NotificationBadge";
import { useAtomValue } from "jotai";
import { hiddenFormIdsAtom } from "@/common_components/form_list/hiddenFormIds";
import { useRouter } from "next/navigation";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";
import { buttonStyle } from "@/recipes/button";
import { Title } from "@/common_components/Title";
import { components } from "@/schema";
import { getSubmitStatusFromDate } from "@/lib/formHelpers";
import { FormList } from "@/common_components/form_list/formList";

const DashboardPage: NextPage = () => {
  const { data: projectRes, error: projectResError, isLoading: projectResIsLoading } = useSWR("/projects/me");
  const project = projectRes ? assignType("/projects/me", projectRes) : undefined;

  const {
    data: formsRes,
    error: formsResError,
    isLoading: formsResIsLoading,
  } = useSWR(() => project && `/forms?project_id=` + project?.id);
  const forms = formsRes ? assignType("/forms", formsRes) : undefined;

  const {
    data: answersRes,
    error: answersResError,
    isLoading: answersResIsLoading,
  } = useSWR(() => project && `/form-answers?project_id=` + project?.id);
  const answers = answersRes ? assignType("/form-answers", answersRes) : undefined;

  const hiddenFormIds = useAtomValue(hiddenFormIdsAtom);

  const isLoading = projectResIsLoading || formsResIsLoading || answersResIsLoading;
  const error = projectResError || formsResError || answersResError;

  const [isSubmittedShown, setIsSubmittedShown] = useState(false);
  const [isHiddenFormsShown, setIsHiddenFormsShown] = useState(false);

  const applicationPeriod = useAtomValue(projectApplicationPeriodAtom);
  const router = useRouter();

  if (applicationPeriod.isIn) {
    router.push("/dashboard");
    return;
  }

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
  const notifications = forms.filter((form) => {
    const isAnswerInclude = !answers.map((answer) => answer.form_id).includes(form.id);
    const isHiddenInclude = !hiddenFormIds.includes(form.id);

    isAnswerInclude && isHiddenInclude && !form.is_draft;
  }).length;
  const toggleFilter = () => setIsSubmittedShown((prev) => !prev);

  return (
    <>
      <div
        className={container({
          padding: 5,
          maxWidth: "6xl",
          marginInline: "auto",
        })}>
        <div>
          <Title>
            申請一覧
            {notifications > 0 && <NotificationBadge count={notifications} />}
          </Title>
        </div>
        <div className={stack({ paddingBlock: 10, gap: 4, alignItems: "flex-start", width: "100%" })}>
          <button
            className={buttonStyle({ visual: isSubmittedShown ? "outline" : "solid", color: "purple" })}
            onClick={toggleFilter}
            aria-pressed={!isSubmittedShown}>
            {isSubmittedShown ? "すべて" : "未提出のみ"}表示
          </button>
          <FormList forms={filterForm(forms, isSubmittedShown, hiddenFormIds, false)} showHiddenToggle={true} />

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
            <FormList forms={filterForm(forms, isSubmittedShown, hiddenFormIds, true)} showHiddenToggle={true} />
          )}
        </div>
      </div>
    </>
  );
};

type form = components["schemas"]["FormSummary"];
const filterForm = (forms: form[], showSubmitted: boolean, hiddenFormIds: string[], isHiddenList: boolean) => {
  return forms.filter((form) => {
    const hidden = hiddenFormIds.includes(form.id);
    if ((isHiddenList && !hidden) || (!isHiddenList && hidden)) {
      return false;
    }

    const status = getSubmitStatusFromDate(form.ends_at, form.answered_at);
    if (showSubmitted) {
      if (status !== "未提出") return false;
    }
    return true;
  });
};

export default DashboardPage;
