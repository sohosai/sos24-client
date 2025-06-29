"use client";

import { container, flex, hstack, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { assignType, client } from "@/lib/openapi";
import Link from "next/link";
import useSWR from "swr";

import { ProjectTableView } from "@/common_components/project/ProjectView";
import toast from "react-hot-toast";
import { notFound, useRouter } from "next/navigation";
import deleteButton from "@/assets/deleteProjectButton.svg?url";
import Image from "next/image";
import { Button } from "@/common_components/Button";
import { NoResultNotice } from "@/common_components/NoResultNotice";
import { getSubmitStatusFromDate } from "@/lib/formHelpers";
import { components } from "@/schema";
import { SubmitStatusBadge } from "@/common_components/SubmitStatusBadge";
import dayjs from "dayjs";
export const runtime = "edge";

const deleteProject = async (project_id: string) => {
  await client
    .DELETE("/projects/{project_id}", { params: { path: { project_id } } })
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
    })
    .catch((e) => {
      throw e;
    });
};

const FormAnswerItem: React.FC<{ answer: components["schemas"]["FormAnswerSummary"] }> = ({ answer }) => {
  const { data, isLoading, error } = useSWR(`/forms/${answer.form_id}`);
  const form = assignType("/forms/{form_id}", data);
  if (isLoading) return;
  if (error) "エラーが発生しました";
  const status = getSubmitStatusFromDate(form.ends_at, answer.created_at);
  return (
    <Link
      href={`/committee/form-answers/${answer.id}`}
      key={answer.id}
      className={hstack({
        width: "full",
        justifyContent: "space-between",
        paddingX: 5,
        paddingY: 3,
        "&:first-child": {
          borderTop: "2px solid black",
        },
        borderBottom: "2px solid token(colors.gray.300)",
      })}>
      <div className={hstack({ gap: 5 })}>
        <span>{dayjs(answer.updated_at).format("MM/DD HH:mm")}</span>
        <span className={css({ fontWeight: "bold" })}>{form.title}</span>
      </div>
      <SubmitStatusBadge status={status} />
    </Link>
  );
};

const ProjectDetailsPage = ({ params }: { params: { project_id: string } }) => {
  const { data, error, isLoading } = useSWR(`/projects/${params.project_id}`);
  const {
    data: formAnswers,
    isLoading: formAnswersIsLoading,
    error: formAnswersError,
  } = useSWR(`/form-answers?project_id=${params.project_id}`);
  const router = useRouter();

  const { data: data_user, isLoading: isLoading_user } = useSWR("/users/me");
  const me = assignType("/users/me", data_user);

  if (isLoading || formAnswersIsLoading) {
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
  const answers = formAnswersError ? null : assignType("/form-answers", formAnswers);

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
            color: "tsukuba.purple",
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
            {!isLoading &&
              !isLoading_user &&
              ["committee_editor", "committee_operator", "administrator"].includes(me.role) && (
                <>
                  <Button color="blue" onClick={() => router.push(`/committee/projects/${project.id}/edit`)}>
                    編集
                  </Button>
                  {["committee_operator", "administrator"].includes(me.role) && (
                    <Image
                      src={deleteButton}
                      alt=""
                      className={css({ cursor: "pointer" })}
                      onClick={() => {
                        window.confirm("本当に削除しますか？") &&
                          toast.promise(deleteProject(project.id), {
                            loading: "企画を削除しています",
                            error: "企画の削除中にエラーが発生しました",
                            success: () => {
                              router.push("/committee/projects");
                              return "企画を削除しました";
                            },
                          });
                      }}
                    />
                  )}
                </>
              )}
          </div>
        </span>
        <ProjectTableView projectData={project} />
        {answers === null ? (
          <NoResultNotice message="技術的な問題により回答を読み込めませんでした" />
        ) : (
          <>
            <h2 className={css({ fontSize: "lg", fontWeight: "bold" })}>回答一覧</h2>
            {answers.length == 0 ? (
              <NoResultNotice message="回答はまだありません" />
            ) : (
              <div
                className={css({
                  width: "full",
                })}>
                {answers.map((answer) => (
                  <FormAnswerItem answer={answer} key={answer.id} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
