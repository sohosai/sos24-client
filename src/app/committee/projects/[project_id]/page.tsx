"use client";

import { container, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { assignType } from "@/lib/openapi";
import dayjs from "dayjs";
import Link from "next/link";
import useSWR from "swr";
import { ProjectTableView } from "@/app/dashboard/ProjectView";

export const runtime = "edge";

const NewsDetailsPage = ({ params }: { params: { project_id: string } }) => {
  const { data, error, isLoading } = useSWR(`/projects/${params.project_id}`);
  if (isLoading) {
    return;
  }
  if (error) {
    switch (error.name) {
      case "news/not-found":
        return <p>このお知らせは存在しません。</p>;
      default:
        return <p>お知らせの読み込み中に不明なエラーが発生しました。</p>;
    }
  }

  const project = assignType("/projects/{project_id}", data);

  return (
    <div className={container({ maxWidth: "4xl" })}>
      <div
        className={stack({
          gap: 3,
          marginY: 8,
        })}>
        <Link
          href="/committee/projects"
          className={css({
            color: "sohosai.purple",
            fontSize: "xs",
          })}>
          ←企画一覧に戻る
        </Link>
        <p
          className={css({
            fontSize: "xs",
          })}>
          最終更新: {project && dayjs(project.updated_at).format("YYYY/MM/DD")}
        </p>
        <h2
          className={css({
            fontSize: "2xl",
            fontWeight: "bold",
            marginBottom: 2,
          })}>
          企画詳細
        </h2>

        <ProjectTableView projectData={project} />
      </div>
    </div>
  );
};

export default NewsDetailsPage;
