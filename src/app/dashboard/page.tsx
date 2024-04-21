"use client";

import { NextPage } from "next";
import { NewsView } from "@/common_components/news/NewsView";
import { container, flex, stack } from "@styled-system/patterns";
import { Title } from "@/common_components/Title";
import Link from "next/link";
import Image from "next/image";
import { basicErrorMessageStyle } from "@/common_components/formFields/styles";

import pulldownIcon from "@/assets/Pulldown.svg?url";
import { css } from "@styled-system/css";
import { Project } from "./Project";
import { Forms } from "./Forms";
import { assignType } from "@/lib/openapi";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const DashboardPage: NextPage = () => {
  let step: 1 | 2 | 3 | 4 | 5 = 2;
  const {
    data: rawProjectData,
    error: projectErr,
    isLoading: projectIsLoading,
    mutate: mutateProject,
  } = useSWR("/projects/me");
  const projectData = assignType("/projects/me", rawProjectData);

  const {
    data: rawFormData,
    error: formErr,
    isLoading: formIsLoading,
    // mutate: mutateForm,
  } = useSWR(projectIsLoading ? null : `/forms?project_id=${projectData.id}`);
  const formData = assignType("/forms", rawFormData);

  const router = useRouter();
  if (projectIsLoading) return;
  if (projectErr) return <p>エラーが発生しました</p>;
  if (!projectData.id) {
    router.push("/register");
    return;
  }

  if (!formIsLoading && formData) {
    let hasAnsweredEveryForm = true;
    let hasAnsweredOathForm = false;
    for (const data of formData) {
      if (data.title === "誓約書提出フォーム") {
        hasAnsweredOathForm = data.answer_id !== null;
      } else if (data.answer_id === null) {
        hasAnsweredEveryForm = false;
      }
    }

    if (hasAnsweredEveryForm) {
      if (hasAnsweredOathForm) {
        step = projectData.sub_owner_id !== null ? 5 : 4;
      } else {
        step = 3;
      }
    } else {
      step = 2;
    }
  }

  return (
    <>
      {!formIsLoading &&
        (step === 5 || (
          <div
            className={css({
              color: "white",
              background: "error",
              width: "100%",
              maxWidth: "40rem",
              marginInline: "auto",
              textAlign: "center",
              paddingY: 4,
            })}>
            まだ企画応募は完了していません
          </div>
        ))}
      <div className={container()}>
        <div className={stack({ gap: 8, marginY: 8 })}>
          <div className={stack({ gap: 6, alignItems: "center" })}>
            <div>
              <Title>企画応募</Title>
            </div>
            <Project projectData={projectData} step={step} />
          </div>
          <div className={stack({ gap: 6, alignItems: "center" })}>
            {formErr ? (
              <div className={basicErrorMessageStyle}>申請フォームの取得に失敗しました</div>
            ) : formIsLoading || !formData ? (
              "Loading"
            ) : (
              <Forms formData={formData} />
            )}
          </div>
          <div className={stack({ gap: 6, alignItems: "center" })}>
            <div>
              <Title>お知らせ</Title>
            </div>
            <div className={flex({ position: "relative", top: 14, justifyContent: "flex-end", width: "90%" })}>
              <Link
                href="/news"
                className={flex({
                  backgroundColor: "tsukuba.purple",
                  borderRadius: 2,
                  paddingX: 4,
                  paddingY: 1,
                  gap: 2,
                })}>
                <Image src={pulldownIcon} alt="" />
                <span
                  className={css({
                    color: "white",
                    fontSize: "xs",
                    fontWeight: "bold",
                  })}>
                  お知らせ一覧へ
                </span>
              </Link>
            </div>
            <NewsView />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
