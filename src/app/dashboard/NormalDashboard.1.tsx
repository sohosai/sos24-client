"use client";
import { NewsView } from "@/common_components/news/NewsView";
import { container, stack } from "@styled-system/patterns";
import { Title } from "@/common_components/Title";
import { basicErrorMessageStyle } from "@/common_components/formFields/styles";
import { assignType } from "@/lib/openapi";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { css } from "@styled-system/css";
import { NoResultNotice } from "@/common_components/NoResultNotice";
import dayjs from "dayjs";
import { getSubmitStatusFromDate, getTimeLeftText } from "@/lib/formHelpers";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { SubmitStatusBadge } from "@/common_components/SubmitStatus";
import { hiddenFormIdsAtom } from "@/app/forms/hiddenFormIds";
import { ProjectView } from "./NormalDashboard";

export const NormalDashboard: React.FC = () => {
  const {
    data: rawProjectData,
    error: projectErr,
    isLoading: projectIsLoading,
    mutate: mutateProject,
  } = useSWR("/projects/me");
  const project = assignType("/projects/me", rawProjectData);
  const {
    data: formsRes,
    error: formsResError,
    isLoading: formsResIsLoading,
  } = useSWR(() => `/forms?project_id=` + project?.id);
  const forms = formsRes ? assignType("/forms", formsRes) : undefined;

  const hiddenFormIds = useAtomValue(hiddenFormIdsAtom);
  const router = useRouter();
  if (projectIsLoading || formsResIsLoading) return;
  if (projectErr) {
    switch (projectErr.name) {
      case "project/no-project-found":
        router.push("/register");
        return;
      default:
        return <p>エラーが発生しました</p>;
    }
  }
  if (!forms) {
    return (
      <p>
        申請の取得中にエラーが発生しました
        <span>({String(formsResError)})</span>
      </p>
    );
  }
  return (
    <>
      <div className={container({ maxW: "6xl" })}>
        <div className={stack({ gap: 8, marginY: 8 })}>
          <div className={stack({ gap: 6 })}>
            <div>
              <Title>企画情報</Title>
            </div>
            {projectErr ? (
              <div className={basicErrorMessageStyle}>企画取得に失敗しました</div>
            ) : (
              <ProjectView mutation={() => mutateProject(project)} projectData={project} />
            )}
            <div>
              <Title>申請</Title>
            </div>
            <div>
              <div
                className={css({
                  width: "full",
                  display: "grid",
                  alignItems: "center",
                  gridTemplateColumns: "1fr 1fr 1fr 3fr 2fr",
                  "& > * > *": {
                    pr: 4,
                    lineHeight: 2,
                  },
                })}>
                <div
                  className={css({
                    display: "contents",
                    color: "gray.500",
                    fontSize: "sm",
                    "& > *": {
                      borderColor: "gray.500",
                      borderBottom: "1px solid",
                    },
                  })}>
                  <div>状態</div>
                  <div>配信日</div>
                  <div>締切日</div>
                  <div>タイトル</div>
                  <div>締切まで</div>
                </div>
                {forms.length == 0 && (
                  <div className={css({ gridColumn: "1/7" })}>
                    <NoResultNotice message="申請はありません" />
                  </div>
                )}
                {forms
                  .filter((form) => {
                    const status = getSubmitStatusFromDate(form.ends_at, form.answered_at);

                    const isHidden = hiddenFormIds.includes(form.id);

                    if (status !== "未提出" || isHidden) {
                      return false;
                    }

                    return true;
                  })
                  // これが効かなくて困っている
                  .slice(0, 3)
                  .map((form) => {
                    const startsAt = dayjs(form.starts_at);
                    const endsAt = dayjs(form.ends_at);
                    const status = "未提出";
                    return (
                      <div
                        key={form.id}
                        className={css({
                          display: "contents",
                        })}>
                        <Link
                          href={`/forms/${form.id}`}
                          className={css({
                            display: "contents",
                          })}>
                          <div className={css({ paddingBlock: 2 })}>
                            <SubmitStatusBadge status={status} />
                          </div>
                          <div>{startsAt.format("YYYY/MM/DD")}</div>
                          <div>{endsAt.format("YYYY/MM/DD")}</div>
                          <div>{form.title}</div>
                          <div>{getTimeLeftText(dayjs(), endsAt, status)}</div>
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div>
              <Title>お知らせ</Title>
            </div>
            <NewsView isDashboard />
          </div>
        </div>
      </div>
    </>
  );
};
