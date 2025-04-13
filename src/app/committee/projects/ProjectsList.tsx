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
        gridTemplateColumns: "1fr 5fr 2fr 2fr",
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
        </div>
        <UserWithAddress name={data.owner_name} email={data.owner_email} />
      </div>
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
  const [sortKey, setSortkey] = useState<"index" | "title" | "location_id">("index");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortByIndex = (a: components["schemas"]["ProjectSummary"], b: components["schemas"]["ProjectSummary"]) =>
    sortOrder === "asc" ? a.index - b.index : b.index - a.index;

  const sortByTitle = (a: components["schemas"]["ProjectSummary"], b: components["schemas"]["ProjectSummary"]) =>
    sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);

  const sortByLocationid = (a: components["schemas"]["ProjectSummary"], b: components["schemas"]["ProjectSummary"]) => {
    const valA = a.location_id;
    const valB = b.location_id;

    const isNullA = valA == null;
    const isNullB = valB == null;

    if (isNullA && !isNullB) return 1;
    if (!isNullA && isNullB) return -1;
    if (isNullA && isNullB) return 0;

    return sortOrder === "asc" ? valA!.localeCompare(valB!) : valB!.localeCompare(valA!);
  };

  const toggleSort = (key: "index" | "title" | "location_id") => {
    if (key === sortKey) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortkey(key);
      setSortOrder("asc");
    }
  };

  const sortedList = [...projectList].sort((a, b) => {
    switch (sortKey) {
      case "title":
        return sortByTitle(a, b);
      case "location_id":
        return sortByLocationid(a, b);
      case "index":
      default:
        return sortByIndex(a, b);
    }
  });

  const TriangleIcons = ({
    sortKey,
    currentKey,
    order,
  }: {
    sortKey: string;
    currentKey: string;
    order: "asc" | "desc";
  }) => {
    const baseStyle = {
      fontSize: "13px",
      lineHeight: 0.8,
    };

    if (sortKey === currentKey) {
      return (
        <span className={css({ display: "flex", flexDirection: "column", alignItems: "center" })}>
          {order === "asc" ? (
            <span className={css({ ...baseStyle, color: "black" })}>▲</span>
          ) : (
            <span className={css({ ...baseStyle, color: "black" })}>▼</span>
          )}
        </span>
      );
    }

    return (
      <span className={css({ display: "flex", flexDirection: "column", alignItems: "center" })}>
        <span className={css({ ...baseStyle })}>▲</span>
        <span className={css({ ...baseStyle })}>▼</span>
      </span>
    );
  };

  return (
    <section className={css({ display: "flex", flexDirection: "column", height: "100%" })}>
      <div
        className={grid({
          columns: 3,
          gridTemplateColumns: "1fr 5fr 2fr 2fr",
          fontWeight: "bold",
          fontSize: "lg",
          paddingBottom: 2,
          borderBottom: "1px solid black",
          backgroundColor: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
        })}>
        <button
          onClick={() => toggleSort("index")}
          className={css({
            all: "unset",
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          })}>
          <span>企画番号</span>
          <TriangleIcons sortKey={sortKey} currentKey="index" order={sortOrder} />
        </button>

        <button
          onClick={() => toggleSort("title")}
          className={css({
            all: "unset",
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          })}>
          <span>企画名</span>
          <TriangleIcons sortKey={sortKey} currentKey="title" order={sortOrder} />
        </button>
        <button
          onClick={() => toggleSort("location_id")}
          className={css({
            all: "unset",
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          })}>
          <span>企画場所</span>
          <TriangleIcons sortKey={sortKey} currentKey="location_id" order={sortOrder} />
        </button>
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
