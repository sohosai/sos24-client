"use client";

import { Button } from "@/components/Button";
import { ProjectCategoryFormatter } from "@/components/ProjectCategoryFormatter";
import { basicErrorMessageStyle, basicFormStyle } from "@/components/formFields/styles";
import { AttributesFormatter } from "@/components/project/AttributesFormatter";
import { assignType, client } from "@/lib/openapi";
import {
  UpdateProjectCommitteeSchema,
  UpdateProjectCommitteeSchemaType,
  projectAttributes,
  projectCategories,
} from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { css, cx } from "@styled-system/css";
import { container, hstack, stack, visuallyHidden } from "@styled-system/patterns";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Arrow from "./three_arrow_left.svg";
import Image from "next/image";
import { getNewInvitationId, shareURL } from "@/app/dashboard/ProjectView";
import { components } from "@/schema";

const ProjectEditPage: NextPage<{ params: { project_id: string } }> = ({ params }) => {
  const { data: rawProject, isLoading, error } = useSWR(`/projects/${params.project_id}`);
  const project = rawProject ? assignType("/projects/{project_id}", rawProject) : undefined;
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateProjectCommitteeSchemaType>({
    resolver: valibotResolver(UpdateProjectCommitteeSchema),
    defaultValues: project,
  });

  const updateProject = async (data: UpdateProjectCommitteeSchemaType) => {
    if (!project) return;
    await client.PUT("/projects/{project_id}", {
      params: {
        path: {
          project_id: project.id,
        },
      },
      body: data as components["schemas"]["UpdateProject"],
    });
  };

  if (isLoading) {
    return;
  }

  if (error) {
    return <>{error}</>;
  }

  const lableAndInputStyle = css({ fontWeight: "bold", "& > input": { fontWeight: "normal", marginTop: 2 } });

  if (!project) {
    return "企画の読み込みに失敗しました";
  }

  return (
    <main className={container()}>
      <form className={stack({ gap: 4 })} onSubmit={handleSubmit(updateProject)}>
        <label className={lableAndInputStyle}>
          企画名
          <input className={basicFormStyle()} {...register("title", { value: project?.title })} />
          {errors.title && <span className={basicErrorMessageStyle}>{errors.title.message}</span>}
        </label>
        <label className={lableAndInputStyle}>
          企画名（ふりがな）
          <input className={basicFormStyle()} {...register("kana_title", { value: project?.kana_title })} />
          {errors.kana_title && <span className={basicErrorMessageStyle}>{errors.kana_title.message}</span>}
        </label>
        <label className={lableAndInputStyle}>
          企画団体名
          <input className={basicFormStyle()} {...register("group_name", { value: project?.group_name })} />
          {errors.group_name && <span className={basicErrorMessageStyle}>{errors.group_name.message}</span>}
        </label>
        <label className={lableAndInputStyle}>
          企画団体名（ふりがな）
          <input
            className={basicFormStyle()}
            {...register("kana_group_name", {
              value: project?.kana_group_name,
            })}
          />
          {errors.kana_group_name && <span className={basicErrorMessageStyle}>{errors.kana_group_name.message}</span>}
        </label>
        <section className={hstack({ justifyContent: "space-between" })}>
          <span className={css({ fontWeight: "bold" })}>企画責任者変更</span>
          <div className={hstack()}>
            <span>{project?.owner_name}</span>
            <Image src={Arrow} alt="" />
            <Button
              type="button"
              color="secondary"
              onClick={async () => shareURL(await getNewInvitationId(project?.id ?? "", "owner"))}>
              変更用URLを発行
            </Button>
          </div>
        </section>
        {project?.sub_owner_name && (
          <section>
            <span>副企画責任者変更</span>
            <div className={hstack()}>
              <span>{project?.owner_name}</span>
              <Image src={Arrow} alt="" />
              <Button type="button" color="secondary">
                変更用URLを発行
              </Button>
            </div>
          </section>
        )}
        <label>企画区分</label>
        <fieldset>
          <legend>どれか一つを選択してください</legend>
          <div className={hstack({ flexWrap: "wrap" })}>
            {projectCategories.map((category) => (
              <label
                key={category}
                className={cx(
                  css({
                    paddingBlock: 2,
                    paddingInline: 6,
                    borderRadius: "2xl",
                    cursor: "pointer",

                    color: "gray.600",
                    backgroundColor: "gray.200",

                    fontSize: "sm",

                    fontWeight: "bold",
                    boxSizing: "border-box",
                    "&:has(> input:checked)": {
                      color: "sohosai.purple",
                      border: "2px solid ",
                      backgroundColor: "white",
                    },
                  }),
                )}>
                <ProjectCategoryFormatter category={category} />
                <input
                  type="radio"
                  value={category}
                  className={visuallyHidden()}
                  {...register("category", { value: project?.category })}
                />
              </label>
            ))}
          </div>
        </fieldset>
        {errors.category && <span className={basicErrorMessageStyle}>{errors.category.message}</span>}
        <span>企画属性</span>
        <fieldset>
          <legend>当てはまるものをすべて選択してください</legend>
          <div className={hstack()}>
            {projectAttributes.map((attribute) => (
              <label
                key={attribute}
                className={css({
                  paddingBlock: 2,
                  paddingInline: 6,
                  borderRadius: "2xl",
                  cursor: "pointer",

                  color: "gray.600",
                  fontSize: "sm",
                  border: "3px solid token(colors.gray.300)",

                  fontWeight: "bold",
                  boxSizing: "border-box",
                  "&:has(> input:checked)": {
                    color: "sohosai.purple",
                    border: "2px solid ",
                    backgroundColor: "white",
                  },
                })}>
                <AttributesFormatter attribute={attribute} />
                <input
                  type="checkbox"
                  value={attribute}
                  defaultChecked={project.attributes.includes(attribute as components["schemas"]["ProjectAttribute"])}
                  {...register("attributes")}
                  className={visuallyHidden()}
                />
              </label>
            ))}
          </div>
        </fieldset>
        {errors.attributes && <span className={basicErrorMessageStyle}>{errors.attributes.message}</span>}
        <Button color="primary">更新</Button>
      </form>
    </main>
  );
};

export default ProjectEditPage;
