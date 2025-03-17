import { ProjectCategoryFormatter } from "@/common_components/ProjectCategoryFormatter";
import { components } from "@/schema";
import { css, cx } from "@styled-system/css";
import { grid, vstack } from "@styled-system/patterns";
import React from "react";
import Link from "next/link";
import { projectCategoryItemStyle } from "@/common_components/formFields/styles";
import { UserWithAddress } from "@/common_components/project/UserWithAddress";
import { ProjectAttributesBadge } from "@/common_components/project/ProjectAttributesBadge";

const ProjectRow: React.FC<{ data: components["schemas"]["ProjectSummary"] }> = ({ data }) => {
  return (
    <div
      className={grid({
        columns: 3,
        gridTemplateColumns: "1fr 7fr 2fr",
        borderBottom: "1px solid token(colors.gray.300)",
        paddingY: 3,
      })}>
      <div
        className={css({
          fontWeight: "bold",
          color: "gray.500",
          fontSize: "lg",
        })}>
        {("000" + data.index).slice(-3)}
      </div>
      <div className={vstack({ alignItems: "start" })}>
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
          })}>
          <Link
            href={`/committee/projects/${data.id}`}
            className={css({
              fontWeight: "bold",
              fontSize: "lg",
              display: "block",
            })}>
            {data.title}
          </Link>
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: ".2rem",
              color: "#A59E9E",
              fontSize: "sm",
              fontWeight: "bold",
            })}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10 5C10 7.4965 7.2305 10.0965 6.3005 10.8995C6.21386 10.9646 6.1084 10.9999 6 10.9999C5.8916 10.9999 5.78614 10.9646 5.6995 10.8995C4.7695 10.0965 2 7.4965 2 5C2 3.93913 2.42143 2.92172 3.17157 2.17157C3.92172 1.42143 4.93913 1 6 1C7.06087 1 8.07828 1.42143 8.82843 2.17157C9.57857 2.92172 10 3.93913 10 5ZM6 7C7.10457 7 8 6.10457 8 5C8 3.89543 7.10457 3 6 3C4.89543 3 4 3.89543 4 5C4 6.10457 4.89543 7 6 7Z"
                fill="#A59E9E"
                stroke="#A59E9E"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {data.location_id ?? "未定"}
          </div>
        </div>
        <UserWithAddress name={data.owner_name} email={data.owner_email} />
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
