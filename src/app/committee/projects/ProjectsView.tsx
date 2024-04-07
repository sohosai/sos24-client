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

export const ProjectsList: React.FC = () => {
  const { data: rawProjectsData, isLoading, error } = useSWR("/projects");
  const projectsData = assignType("/projects", rawProjectsData) ?? [];
  const [attributesFilter, setAttributesFilter] = useState<components["schemas"]["ProjectAttribute"] | "">("");
  const [categoryFilter, setCategoryFilter] = useState<components["schemas"]["ProjectCategory"] | "">("");
  const generatedProjectData = (() => {
    return projectsData
      .filter((e) => attributesFilter === "" || e.attributes.includes(attributesFilter))
      .filter((e) => categoryFilter == "" || e.category === categoryFilter)
      .sort((big, small) => big.index - small.index);
  })();
  const filterStyle = css({
    position: "relative",
    background: `url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24"><path fill="%23000000" d="M0.443719 0.53466C0.443719 0.432857 0.546107 0.331055 0.716756 0.331055L9.24918 0.331055C9.41983 0.331055 9.52222 0.432857 9.52222 0.53466C9.52222 0.560111 9.52222 0.611012 9.48809 0.636463L5.22188 5.5739C5.15362 5.65025 5.05123 5.6757 4.98297 5.6757C4.94884 5.6757 4.81232 5.6757 4.74406 5.5739L0.477848 0.636463C0.443718 0.611012 0.443719 0.560111 0.443719 0.53466Z" /></svg>') no-repeat`,
    backgroundRepeat: "no-repeat",
    backgroundPositionX: 10,
    backgroundPositionY: "10px",
    appearance: "none",
    paddingLeft: 6,
  });

  // ToDo: 後でvalibotと統合
  const projectAttributes: components["schemas"]["ProjectAttribute"][] = [
    "academic",
    "art",
    "official",
    "inside",
    "outside",
  ];

  return (
    <>
      <div className={hstack({ gap: 4, marginTop: 10 })}>
        <select
          onChange={(e) => setAttributesFilter(e.target.value as "" | components["schemas"]["ProjectAttribute"])}
          className={cx(filterSelectorStyle, filterStyle)}>
          <option value="">企画属性</option>
          {projectAttributes.map((e) => (
            <option value={e} key={e}>
              <AttributesFormatter attribute={e} />
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setCategoryFilter(e.target.value as "" | components["schemas"]["ProjectCategory"])}
          className={cx(filterSelectorStyle, filterStyle)}>
          <option value="">企画区分</option>
          {projectCategories.map((e) => (
            <option value={e} key={e}>
              <ProjectCategoryFormatter category={e} />
            </option>
          ))}
        </select>
      </div>
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
          {isLoading
            ? "Loading"
            : error
              ? "error"
              : generatedProjectData.map((project) => (
                  <li key={project.id}>
                    <ProjectRow data={project} />
                  </li>
                ))}
        </ul>
      </section>
    </>
  );
};
