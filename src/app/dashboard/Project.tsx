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
export const Project: React.FC = () => {
  const [editable, setEditable] = useState(false);
  const {
    data: rawProjectData,
    error: projectErr,
    isLoading: projectIsLoading,
    mutate: mutateProject,
  } = useSWR("/projects/me");
  const projectData = assignType("/projects/me", rawProjectData);

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
              <ProjectTableView
                isEditMode={editable}
                onSubmit={() => {
                  mutateProject(rawProjectData);
                  setEditable(false);
                }}
                projectData={projectData}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};
