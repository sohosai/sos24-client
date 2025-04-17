"use client";
import { NewsView } from "@/common_components/news/NewsView";
import { container, stack } from "@styled-system/patterns";
import { Title } from "@/common_components/Title";
import { basicErrorMessageStyle } from "@/common_components/formFields/styles";
import { css } from "@styled-system/css";
import { ApplicationPeriodProject } from "./Project";
import { Forms } from "./Forms";
import { assignType } from "@/lib/openapi";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const SortStatus: "all" | "draft" | "scheduled" | "published" = "all";
export const RegistrationDashboard: React.FC = () => {
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
  } = useSWR(projectIsLoading && !projectData ? null : `/forms?project_id=${projectData?.id}`);
  const formData = assignType("/forms", rawFormData);

  const router = useRouter();
  if (projectIsLoading) return;
  if (projectErr) {
    switch (projectErr.name) {
      case "project/no-project-found":
        router.push("/register");
        return;
      default:
        return <p>エラーが発生しました</p>;
    }
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
        (step !== 5 ? (
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
        ) : (
          <div
            className={css({
              color: "white",
              background: "sohosai.blue",
              width: "100%",
              maxWidth: "40rem",
              marginInline: "auto",
              textAlign: "center",
              paddingY: 4,
            })}>
            企画応募が完了しました！
          </div>
        ))}
      <div className={container()}>
        <div className={stack({ gap: 8, marginY: 8 })}>
          <div className={stack({ gap: 6, alignItems: "center" })}>
            <div>
              <Title>企画応募</Title>
            </div>
            {projectErr ? (
              <div className={basicErrorMessageStyle}>企画取得に失敗しました</div>
            ) : (
              <ApplicationPeriodProject
                projectData={projectData}
                mutation={() => {
                  mutateProject(rawProjectData);
                }}
                step={step}
              />
            )}
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
            <NewsView isDashboard status={SortStatus} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationDashboard;
