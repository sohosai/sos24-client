import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import React, { ReactNode } from "react";
import { categoryToLabel } from "@/components/news/CategoryBadges";
import { css, cx } from "@styled-system/css";
import { basicErrorMessageStyle } from "@/components/forms/styles";

const TableCellStyle = css({
  paddingX: 14,
  paddingY: 4,
});

const TableRow = ({ label, value }: { label: ReactNode; value: ReactNode }) => (
  // This is a workaround to add border-radius to table row
  // https://stackoverflow.com/questions/4094126/how-to-add-border-radius-on-table-row
  <tr
    className={css({
      borderRadius: "token(radii.full)",
      _even: {
        backgroundColor: "gray.100",
      },
    })}>
    <td
      className={cx(
        TableCellStyle,
        css({
          borderRadius: "token(radii.md) 0 0 token(radii.md)",
          fontWeight: "bold",
        }),
      )}>
      {label}
    </td>
    <td
      className={cx(
        TableCellStyle,
        css({
          borderRadius: "0 token(radii.md) token(radii.md) 0",
          overflow: "hidden",
        }),
      )}>
      {value}
    </td>
  </tr>
);

export const ProjectView: React.FC = () => {
  const { data: rawProjectData, error: projectErr, isLoading: projectIsLoading } = useSWR("/projects/me");
  const projectData = assignType("/projects/me", rawProjectData);
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
                <TableRow label="企画名" value={projectData.title} />
                <TableRow label="企画名（ふりがな）" value={projectData.kana_title} />
                <TableRow label="企画団体名" value={projectData.group_name} />
                <TableRow label="企画団体名（ふりがな）" value={projectData.kana_group_name} />
                <TableRow label="企画責任者" value={projectData.owner_name} />
                <TableRow
                  label="副企画責任者"
                  value={projectData.sub_owner_name ?? <span className={css({ color: "red.800" })}>未設定</span>}
                />
                <TableRow label="企画区分" value={categoryToLabel(projectData.category)} />
                <TableRow label="企画属性" value={projectData.attributes} />
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
};
