import useSWR from "swr";
import { assignType, client } from "@/lib/openapi";
import React, { ReactNode } from "react";
import { categoryToLabel } from "@/components/news/CategoryBadges";
import { css, cx } from "@styled-system/css";
import { basicErrorMessageStyle } from "@/components/forms/styles";
import toast from "react-hot-toast";
import { ProjectAttributesBadge } from "@/components/project/AttirbutesBadge";
import { grid } from "@styled-system/patterns";

const TableCellStyle = css({
  paddingX: 14,
  paddingY: 4,
  alignSelf: "center",
});

export const TableRow = ({ label, children, formId }: { label: ReactNode; children: ReactNode; formId?: string }) => (
  // This is a workaround to add border-radius to table row
  // https://stackoverflow.com/questions/4094126/how-to-add-border-radius-on-table-row
  <div
    className={grid({
      columns: 2,
      _even: {
        backgroundColor: "gray.100",
      },
      borderRadius: "md",
    })}>
    <label htmlFor={formId} className={cx(TableCellStyle, css({ fontWeight: "bold" }))}>
      {label}
    </label>
    <div className={TableCellStyle}>{children}</div>
  </div>
);
export const handleCopyInviteLink = (project_id: string, position: "owner" | "sub_owner") => {
  client
    .POST("/invitations", {
      body: {
        project_id,
        position,
      },
    })
    .then((res) => {
      const data = [
        new ClipboardItem({
          "text/plain": new Blob([`${document.location.origin}/invitations/${res.data?.id}`], { type: "text/plain" }),
        }),
      ];
      navigator.clipboard
        .write(data)
        .then(() => {
          toast.success("招待リンクをコピーしました");
        })
        .catch(() => {
          toast.error("招待リンクのコピーに失敗しました");
        });
    })
    .catch((e) => {
      toast.error("招待リンクの作成に失敗しました");
      throw new Error(e);
    });
};

export const ProjectView: React.FC<{ hideSubOwner?: boolean }> = ({ hideSubOwner = false }) => {
  const { data: rawProjectData, error: projectErr, isLoading: projectIsLoading } = useSWR("/projects/me");
  const projectData = assignType("/projects/me", rawProjectData);
  // positionの型はschemaの型を使いたい

  return (
    <>
      {projectIsLoading ? (
        "Loading"
      ) : (
        <>
          {projectErr ? (
            <div className={basicErrorMessageStyle}>企画取得に失敗しました</div>
          ) : (
            <table className={css({ borderCollapse: "separate", borderSpacing: 0, width: "2xl" })}>
              <tbody>
                <TableRow label="企画名" children={projectData.title} formId="title" />
                <TableRow label="企画名（ふりがな）" children={projectData.kana_title} formId="kana_title" />
                <TableRow label="企画団体名" children={projectData.group_name} formId="group_name" />
                <TableRow
                  label="企画団体名（ふりがな）"
                  children={projectData.kana_group_name}
                  formId="kana_group_name"
                />
                {/*企画応募画面で誓約書提出を副責任者登録より前にやってもらうため*/}
                {hideSubOwner ? null : (
                  <TableRow
                    label={
                      <span
                        className={css(
                          !projectData.sub_owner_name && {
                            position: "relative",
                            _after: {
                              content: '""',
                              position: "absolute",
                              top: "-50%",
                              right: "-20%",
                              width: 3,
                              height: 3,
                              backgroundColor: "error",
                              borderRadius: "full",
                              display: "block",
                            },
                          },
                        )}>
                        副企画責任者
                      </span>
                    }
                    children={
                      projectData.sub_owner_name ?? (
                        <button
                          className={css({ color: "sohosai.purple", textDecoration: "underline", cursor: "pointer" })}
                          onClick={() => handleCopyInviteLink(projectData.id, "sub_owner")}>
                          招待リンクをコピー
                        </button>
                      )
                    }
                  />
                )}

                <TableRow label="企画区分" children={categoryToLabel(projectData.category)} formId="category" />
                <TableRow label="企画属性" children={<ProjectAttributesBadge attributes={projectData.attributes} />} />
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
};
