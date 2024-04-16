"use client";

import { container, flex, hstack, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { assignType, client } from "@/lib/openapi";
import Link from "next/link";
import useSWR from "swr";

import { ProjectTableView } from "@/components/project/ProjectView";
import toast from "react-hot-toast";
import { notFound, useRouter } from "next/navigation";
import deleteButton from "@/components/assets/deleteProjectButton.svg";
import Image from "next/image";
import { Button } from "@/components/Button";
export const runtime = "edge";

const deleteProject = async (project_id: string) => {
  await client.DELETE("/projects/{project_id}", { params: { path: { project_id } } }).catch((e) => {
    throw e;
  });
};

const NewsDetailsPage = ({ params }: { params: { project_id: string } }) => {
  const { data, error, isLoading } = useSWR(`/projects/${params.project_id}`);
  const router = useRouter();

  if (isLoading) {
    return;
  }
  if (error) {
    switch (error.name) {
      case "project/not-found":
      case "project/invalid-uuid":
        notFound();
      default:
        return <p>企画の読み込み中に不明なエラーが発生しました。</p>;
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
        <span className={(hstack({ gap: 2 }), flex({ justifyContent: "space-between" }))}>
          <h2
            className={css({
              fontSize: "2xl",
              fontWeight: "bold",
              marginBottom: 2,
            })}>
            企画詳細
          </h2>
          <div className={hstack({ flexDir: "row-reverse" })}>
            <Button color="blue" onClick={() => router.push(`/committee/projects/${project.id}/edit`)}>
              編集
            </Button>
            <Image
              src={deleteButton}
              alt=""
              className={css({ cursor: "pointer" })}
              onClick={() => {
                window.confirm("本当に削除しますか？") &&
                  deleteProject(project.id).then(() => {
                    toast.success("企画を削除しました。");
                    router.push("/committee/projects");
                  });
              }}
            />
          </div>
        </span>
        <ProjectTableView projectData={project} />
      </div>
    </div>
  );
};

export default NewsDetailsPage;
