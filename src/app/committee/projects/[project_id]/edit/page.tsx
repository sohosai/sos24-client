"use client";

import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";
import { container } from "@styled-system/patterns";
import { NextPage } from "next";
import useSWR from "swr";
import Link from "next/link";
import { ProjectEditForm } from "./ProjectEditForm";

export const runtime = "edge";

const ProjectEditPage: NextPage<{ params: { project_id: string } }> = ({ params }) => {
  const { data: rawProject, isLoading, error } = useSWR(`/projects/${params.project_id}`);
  const project = rawProject ? assignType("/projects/{project_id}", rawProject) : undefined;
  if (isLoading) {
    return;
  }

  if (error) {
    return <>{error}</>;
  }

  if (!project) {
    return "企画の読み込みに失敗しました";
  }

  return (
    <main className={container({ maxWidth: "4xl", marginY: 8 })}>
      <Link className={css({ color: "sohosai.purple", fontSize: "xs" })} href={`/committee/projects/${project.id}`}>
        ←企画に戻る
      </Link>
      <ProjectEditForm project={project} />
    </main>
  );
};

export default ProjectEditPage;
