"use client";

import { container, hstack, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { assignType, client } from "@/lib/openapi";
import Link from "next/link";
import useSWR from "swr";
import { ProjectTableView } from "@/components/project/ProjectView";
import { Button } from "@/components/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
      case "projects/not-found":
        return <p>この企画は存在しません。</p>;
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
        </div>
        <ProjectTableView projectData={project} isCommittee />

        <section className={hstack({ justifyContent: "space-between" })}>
          <h3 className={css({ fontWeight: "bold" })}>企画の削除</h3>
          <Button
            color="secondary"
            onClick={() => {
              if (window.confirm("本当に削除して良いですか?")) {
                deleteProject(project.id)
                  .then(() => {
                    toast.success("企画を削除しました");
                    router.push("/committee/projects");
                  })
                  .catch(() => {
                    toast.error("企画の削除に失敗しました");
                  });
              }
            }}>
            削除
          </Button>
        </section>
      </div>
    </div>
  );
};

export default NewsDetailsPage;
