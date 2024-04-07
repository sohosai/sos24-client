"use client";

import { useState } from "react";
import { NextPage } from "next";
import useSWR from "swr";
import { fetcherWithToken } from "@/lib/swr";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";

import { Button } from "@/_common_components/Button";
import { FormsList } from "./FormsList";

const DashboardPage: NextPage = () => {
  const { data: projectRes } = useSWR("/projects/me", fetcherWithToken);
  const project = projectRes ? assignType("/projects/me", projectRes.json) : undefined;

  const projectId = project?.id;
  const { data: formsRes } = useSWR(`/forms?project_id=${projectId}`, fetcherWithToken);
  const forms = formsRes ? assignType("/forms", formsRes) : undefined;

  const { data: answersRes } = useSWR(`/form-answers?project_id=${projectId}`, fetcherWithToken);
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
          {(projectRes && !projectRes.ok) || (formsRes && !formsRes?.ok) || (answersRes && !answersRes?.ok) ? (
            <p>
              フォームの取得中にエラーが発生しました(
              {(projectRes && !projectRes?.ok ? `Project: ${projectRes?.statusCode} ` : "") +
                (formsRes && !formsRes?.ok ? `Forms: ${formsRes?.statusCode} ` : "") +
                (answersRes && !answersRes?.ok ? `Answers: ${answersRes?.statusCode}` : "")}
              )
            </p>
          ) : (
            <>
              <Button
                color={filterUnsubmitted ? "tsukuba.purple" : "secondary"}
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
