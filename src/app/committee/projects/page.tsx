"use client";

import { container, hstack } from "@styled-system/patterns";
import { NextPage } from "next";
import { ProjectsList } from "./ProjectsList";
import { css } from "@styled-system/css";
import { assignType } from "@/lib/openapi";
import { useState } from "react";
import useSWR from "swr";
import { NoResultNotice } from "@/common_components/NoResultNotice";
import { buttonStyle } from "@/recipes/button";
import toast from "react-hot-toast";
import { handleExport } from "@/lib/export";
import { useAuthState } from "@/lib/firebase";
import ProjectTypeSelector, { ProjectType } from "./components/ProjectTypeSelector";

const ProjectsPage: NextPage = () => {
  const { data: rawProjectsData, isLoading, error } = useSWR("/projects");
  const projectsData = assignType("/projects", rawProjectsData) ?? [];
  const { user } = useAuthState();
  const [projectType, setProjectType] = useState<ProjectType>({
    location: ["屋内", "屋外", "UNITED", "1A", "会館"],
    food: ["食品なし", "仕込み場必要", "仕込み場不要", "既製食品販売"],
    committee: ["委員会でない"],
    attributes: ["その他", "学術", "芸術"],
  });

  const generatedProjectData = (() => {
    return projectsData
      .filter(
        (e) =>
          (projectType.committee.includes("委員会でない") && !e.attributes.includes("official")) ||
          (projectType.committee.includes("委員会") && e.attributes.includes("official")),
      )
      .filter(
        (e) =>
          (projectType.attributes.includes("その他") &&
            !e.attributes.includes("academic") &&
            !e.attributes.includes("academic")) ||
          (projectType.attributes.includes("学術") && e.attributes.includes("academic")) ||
          (projectType.attributes.includes("芸術") && e.attributes.includes("art")),
      )
      .filter(
        (e) =>
          (projectType.food.includes("食品なし") &&
            (e.category.includes("general") ||
              !e.category.includes("food_with_kitchen") ||
              !e.category.includes("food_without_kitchen") ||
              !e.category.includes("food_without_cooking"))) ||
          (projectType.food.includes("仕込み場必要") && e.category.includes("food_with_kitchen")) ||
          (projectType.food.includes("仕込み場不要") && e.category.includes("food_without_kitchen")) ||
          (projectType.food.includes("既製食品販売不要") && e.category.includes("food_without_cooking")),
      )
      .sort((big, small) => big.index - small.index);
  })();

  const typeSelectorOnChangeHandler = (value: ProjectType) => {
    setProjectType(value);
  };

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
          <ProjectTypeSelector value={projectType} onChange={typeSelectorOnChangeHandler} />
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
