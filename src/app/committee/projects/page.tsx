"use client";

import { container } from "@styled-system/patterns";
import { NextPage } from "next";
import { ProjectsList } from "./ProjectsView";
import { css } from "@styled-system/css";

const ProjectsPage: NextPage = () => {
  return (
    <div className={container({ marginY: 8 })}>
      <h2
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
        })}>
        企画一覧
      </h2>
      <ProjectsList />
    </div>
  );
};

export default ProjectsPage;
