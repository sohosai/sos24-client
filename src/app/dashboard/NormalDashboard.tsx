"use client";
import { NewsView } from "@/common_components/news/NewsView";
import Image from "next/image";
import { container, flex, stack, vstack } from "@styled-system/patterns";
import { Title } from "@/common_components/Title";
import { basicErrorMessageStyle } from "@/common_components/formFields/styles";
import { assignType } from "@/lib/openapi";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ProjectTableView } from "@/common_components/project/ProjectView";
import { components } from "@/schema";
import { css } from "@styled-system/css";
import { getSubmitStatusFromDate } from "@/lib/formHelpers";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { hiddenFormIdsAtom } from "@/common_components/form_list/hiddenFormIds";
import pulldownIcon from "@/assets/Pulldown.svg?url";
import { FormList } from "@/common_components/form_list/formList";

const ProjectView: React.FC<{
  projectData: components["schemas"]["Project"];
  mutation: () => void;
}> = ({ projectData, mutation }) => {
  return (
    <>
      <div className={vstack({})}>
        <ProjectTableView
          isEditMode={false}
          onSubmit={() => {
            mutation();
          }}
          projectData={projectData}
        />
      </div>
    </>
  );
};

const FormListForDashboard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const {
    data: formsRes,
    error: formsResError,
    isLoading: formsResIsLoading,
  } = useSWR(() => `/forms?project_id=` + projectId);
  const forms = formsRes ? assignType("/forms", formsRes) : undefined;

  const hiddenFormIds = useAtomValue(hiddenFormIdsAtom);
  if (formsResIsLoading) return;
  if (!forms) {
    return (
      <p>
        申請の取得中にエラーが発生しました
        <span>({String(formsResError)})</span>
      </p>
    );
  }

  const formsToBeDisplayed = forms
    .filter((form) => {
      const status = getSubmitStatusFromDate(form.ends_at, form.answered_at);

      const isHidden = hiddenFormIds.includes(form.id);

      if (status !== "未提出" || isHidden || form.is_draft) {
        return false;
      }

      return true;
    })
    .slice(0, 3);

  return <FormList forms={formsToBeDisplayed} showHiddenToggle={false} />;
};

export const NormalDashboard: React.FC = () => {
  const {
    data: rawProjectData,
    error: projectErr,
    isLoading: projectIsLoading,
    mutate: mutateProject,
  } = useSWR("/projects/me");
  const project = assignType("/projects/me", rawProjectData);

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
  const SortStatus: "all" | "draft" | "scheduled" | "published" = "all";
  return (
    <>
      <div className={container({ maxW: "6xl" })}>
        <div className={stack({ gap: 8, marginY: 8 })}>
          <div className={stack({ gap: 6 })}>
            <div>
              <Title>企画情報</Title>
            </div>
            {projectErr ? (
              <div className={basicErrorMessageStyle}>企画取得に失敗しました</div>
            ) : (
              <ProjectView mutation={() => mutateProject(project)} projectData={project} />
            )}
            <div>
              <Title>申請</Title>
            </div>
            <div>
              <div className={vstack({ alignItems: "end" })}>
                <Link
                  href="/forms"
                  className={flex({
                    backgroundColor: "tsukuba.purple",
                    borderRadius: 2,
                    paddingX: 4,
                    paddingY: 1,
                    gap: 2,
                  })}>
                  <Image
                    src={pulldownIcon}
                    alt=""
                    className={css({
                      display: "block",
                      height: "auto",
                    })}
                  />
                  <span
                    className={css({
                      color: "white",
                      fontSize: "xs",
                      fontWeight: "bold",
                    })}>
                    申請一覧へ
                  </span>
                </Link>
              </div>
              <FormListForDashboard projectId={project.id} />
            </div>
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

export default NormalDashboard;
