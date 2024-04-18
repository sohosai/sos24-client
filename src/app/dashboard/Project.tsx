"use client";
import { vstack } from "@styled-system/patterns";
import { Title } from "@/common_components/Title";
import { css } from "@styled-system/css";
import { useState } from "react";
import { Button } from "@/common_components/Button";
import { ProjectTableView } from "@/common_components/project/ProjectView";
import { assignType } from "@/lib/openapi";
import useSWR from "swr";
import { basicErrorMessageStyle } from "@/common_components/formFields/styles";
import { RegistrationProgress } from "@/common_components/RegistrationProgress";

export const Project: React.FC = () => {
  const [editable, setEditable] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
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
    mutate: mutateForm,
  } = useSWR(projectIsLoading ? null : `/forms?project_id=${projectData.id}`);
  const formData = assignType("/forms", rawFormData);

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
        if (projectData.sub_owner_id !== null) {
          setStep(5);
        }
        setStep(4);
      } else {
        setStep(3);
      }
      setStep(hasAnsweredOathForm ? 3 : 2);
    }
  }

  return (
    <>
      <Title>企画情報</Title>
      <div className={vstack({})}>
        {!editable && (
          <Button color="blue" className={css({ alignSelf: "end" })} onClick={() => setEditable((e) => !e)}>
            {editable ? "保存" : "編集"}する
          </Button>
        )}
        {projectIsLoading ? (
          "Loading"
        ) : (
          <>
            {projectErr ? (
              <div className={basicErrorMessageStyle}>企画取得に失敗しました</div>
            ) : (
              <>
                <ProjectTableView
                  isEditMode={editable}
                  onSubmit={() => {
                    mutateProject(rawProjectData);
                    setEditable(false);
                  }}
                  projectData={projectData}
                />
                <RegistrationProgress step={step} />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
