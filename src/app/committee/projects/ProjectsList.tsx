import { ProjectCategoryFormatter } from "@/components/ProjectCategoryFormatter";
import { ProjectAttributesBadge } from "@/components/project/AttirbutesBadge";
import { projectCategoryItemStyle } from "@/components/register/styles";
import { components } from "@/schema";
import { css, cx } from "@styled-system/css";
import { center, grid, hstack, vstack } from "@styled-system/patterns";
import MailAddressIcon from "@/components/assets/MailAddress.svg";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

const ProjectRow: React.FC<{ data: components["schemas"]["ProjectSummary"] }> = ({ data }) => {
  return (
    <div
      className={grid({
        columns: 3,
        gridTemplateColumns: "1fr 7fr 2fr",
        borderBottom: "1px solid token(colors.gray.300)",
        paddingY: 3,
      })}>
      <div className={css({ fontWeight: "bold", color: "gray.500", fontSize: "lg" })}>
        {("000" + data.index).slice(-3)}
      </div>
      {/* 将来的に企画責任者名を含める? */}
      <div className={vstack({ alignItems: "start" })}>
        <Link
          href={`/committee/projects/${data.id}`}
          className={css({ fontWeight: "bold", fontSize: "lg", display: "block" })}>
          {data.title}
        </Link>
        <div
          className={hstack({ alignItems: "center", zIndex: 2, cursor: "pointer" })}
          onClick={() => {
            navigator.clipboard
              .writeText(data.owner_email)
              .then(() => toast.success("企画責任者のメールアドレスをコピーしました"))
              .catch(() => toast.error("コピーに失敗しました"));
          }}>
          <Image src={MailAddressIcon} alt="" className={css({ height: "full" })} />
          {data.owner_name}
        </div>
      </div>
      <div className={vstack({ alignItems: "end" })}>
        <div
          className={cx(projectCategoryItemStyle, css({ fontSize: "sm", fontWeight: "bold", width: "fit-content" }))}>
          <ProjectCategoryFormatter category={data.category} />
        </div>
        <ProjectAttributesBadge attributes={data.attributes ?? []} />
      </div>
    </div>
  );
};

export const ProjectsList: React.FC<{ projectList: components["schemas"]["ProjectSummary"][] }> = ({ projectList }) => {
  return (
    <>
      <section className={css({ marginY: 3 })}>
        <div
          className={grid({
            columns: 3,
            gridTemplateColumns: "1fr 7fr 2fr",
            fontWeight: "bold",
            fontSize: "lg",
            paddingBottom: 2,
            borderBottom: "1px solid black",
          })}>
          <div>企画番号</div>
          <div>企画名</div>
          <div>企画区分</div>
        </div>
        <ul>
          {projectList.map((e) => (
            <li key={e.id}>
              <ProjectRow data={e} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
