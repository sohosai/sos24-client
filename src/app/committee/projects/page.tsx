"use client";

import { container, hstack } from "@styled-system/patterns";
import { NextPage } from "next";
import { ProjectsList } from "./ProjectsList";
import { css } from "@styled-system/css";
import { assignType } from "@/lib/openapi";
import { components } from "@/schema";
import { useState } from "react";
import useSWR from "swr";
import { NoResultNotice } from "@/common_components/NoResultNotice";
import { buttonStyle } from "@/recipes/button";
import toast from "react-hot-toast";
import { handleExport } from "@/lib/export";
import { useAuthState } from "@/lib/firebase";
import ProjectTypeSelector, { ProjectType } from "./components/ProjectTypeSelector";

const filterStyle = css({
  position: "relative",
  background: `url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24"><path fill="%23000000" d="M0.443719 0.53466C0.443719 0.432857 0.546107 0.331055 0.716756 0.331055L9.24918 0.331055C9.41983 0.331055 9.52222 0.432857 9.52222 0.53466C9.52222 0.560111 9.52222 0.611012 9.48809 0.636463L5.22188 5.5739C5.15362 5.65025 5.05123 5.6757 4.98297 5.6757C4.94884 5.6757 4.81232 5.6757 4.74406 5.5739L0.477848 0.636463C0.443718 0.611012 0.443719 0.560111 0.443719 0.53466Z" /></svg>') no-repeat`,
  backgroundRepeat: "no-repeat",
  backgroundPositionX: 10,
  backgroundPositionY: "10px",
  appearance: "none",
  paddingLeft: 6,
});
const ProjectsPage: NextPage = () => {
  const { data: rawProjectsData, isLoading, error } = useSWR("/projects");
  const projectsData = assignType("/projects", rawProjectsData) ?? [];
  const [attributesFilter, setAttributesFilter] = useState<components["schemas"]["ProjectAttribute"] | "">("");
  const [categoryFilter, setCategoryFilter] = useState<components["schemas"]["ProjectCategory"] | "">("");
  const { user } = useAuthState();
  const generatedProjectData = (() => {
    return projectsData
      .filter(
        (e) =>
          (attributesFilter === "" || e.attributes.includes(attributesFilter)) &&
          (categoryFilter == "" || e.category === categoryFilter),
      )
      .sort((big, small) => big.index - small.index);
  })();

  const [projectType, setProjectType] = useState<ProjectType>({
    location: [],
    food: [],
    committee: [],
    attributes: [],
  });

  return (
    <div className={container({ marginY: 8 })}>
      <div className={hstack()}>
        <h2
          className={css({
            fontSize: "2xl",
            fontWeight: "bold",
          })}>
          企画一覧
        </h2>
      </div>
      <div className={hstack({ justifyContent: "space-between", alignItems: "center", marginTop: 10 })}>
        <div className={hstack({ gap: 4 })}>
          <div>企画番号</div>
          <div>場所番号</div>
        </div>
        <button
          className={buttonStyle({ visual: "outline", color: "purple" })}
          onClick={() =>
            toast.promise(
              handleExport({
                path: `/projects/export`,
                user,
                fileName: `企画一覧.csv`,
                fileType: "text/csv",
              }),
              {
                loading: "エクスポートしています",
                success: "エクスポートに成功しました",
                error: "エクスポートに失敗しました",
              },
            )
          }>
          CSVダウンロード
        </button>
      </div>
      <div
        className={css({
          display: "flex",
          gap: "40px",
          alignItems: "start",
        })}>
        <div
          className={css({
            minWidth: "200px",
            maxWidth: "300px",
            flexShrink: 0,
            paddingRight: "40px",
            borderRight: "1px solid",
            borderColor: "gray.300",
            marginTop: "20px",
          })}>
          <ProjectTypeSelector value={projectType} onChange={setProjectType} />
        </div>
        <div className={css({ flexGrow: 1, minWidth: "500px" })}>
          {isLoading ? (
            "Loading"
          ) : error ? (
            "error"
          ) : generatedProjectData.length === 0 ? (
            <NoResultNotice message="企画はありません" />
          ) : (
            <ProjectsList projectList={generatedProjectData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
