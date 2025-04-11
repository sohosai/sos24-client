import { ProjectCategoryFormatter } from "@/common_components/ProjectCategoryFormatter";
import { components } from "@/schema";
import { css, cx } from "@styled-system/css";
import { grid, vstack } from "@styled-system/patterns";
import React, { useState } from "react";
import Link from "next/link";
import { projectCategoryItemStyle } from "@/common_components/formFields/styles";
import { UserWithAddress } from "@/common_components/project/UserWithAddress";
import { ProjectAttributesBadge } from "@/common_components/project/ProjectAttributesBadge";
import LocationIcon from "./Location.svg?url";
import Image from "next/image";

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
            <Image src={LocationIcon} alt="" />
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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedList = [...projectList].sort((a, b) => (sortOrder === "asc" ? a.index - b.index : b.index - a.index));

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <section className={css({ display: "flex", flexDirection: "column", height: "100%" })}>
      <div
        className={grid({
          columns: 3,
          gridTemplateColumns: "1fr 7fr 2fr",
          fontWeight: "bold",
          fontSize: "lg",
          paddingBottom: 2,
          borderBottom: "1px solid black",
          backgroundColor: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
        })}>
        <div onClick={toggleSortOrder} className={css({ cursor: "pointer", userSelect: "none" })}>
          企画番号 {sortOrder === "asc" ? "▲" : "▼"}
        </div>
        <div>企画名</div>
        <div>企画区分</div>
      </div>
      <div
        className={css({
          overflowY: "auto",
        })}>
        <ul>
          {sortedList.map((e) => (
            <li key={e.id}>
              <ProjectRow data={e} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
