import { ProjectCategoryFormatter } from "@/components/ProjectCategoryFormatter";
import { ProjectAttributesBadge } from "@/components/project/AttirbutesBadge";
import { projectCategoryItemStyle } from "@/components/register/styles";
import { assignType } from "@/lib/openapi";
import { components } from "@/schema";
import { css, cx } from "@styled-system/css";
import { grid, hstack, vstack } from "@styled-system/patterns";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { basicFormStyle, dropdownStyle } from "@/components/forms/styles";
import { filterSelectorStyle } from "@/components/news/FilterSelector";
import { AttributesFormatter } from "@/components/project/AttributesFormatter";
import { projectCategories } from "@/lib/valibot";

const ProjectRow: React.FC<{ data: components["schemas"]["ProjectSummary"] }> = ({ data }) => {
  return (
    <Link
      href={`/committee/projects/${data.id}`}
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
        <h2 className={css({ fontWeight: "bold", fontSize: "lg" })}>{data.title}</h2>
      </div>
      <div className={vstack({ alignItems: "end" })}>
        <div
          className={cx(projectCategoryItemStyle, css({ fontSize: "sm", fontWeight: "bold", width: "fit-content" }))}>
          <ProjectCategoryFormatter category={data.category} />
        </div>
        <ProjectAttributesBadge attributes={data.attributes ?? []} />
      </div>
    </Link>
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
