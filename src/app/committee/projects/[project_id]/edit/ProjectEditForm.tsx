"use client";
import { Button } from "@/common_components/Button";
import { basicErrorMessageStyle, basicFormStyle } from "@/common_components/formFields/styles";
import { AttributesFormatter } from "@/common_components/project/AttributesFormatter";
import { client } from "@/lib/openapi";
import { UpdateProjectCommitteeSchema, UpdateProjectCommitteeSchemaType, projectAttributes } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { css } from "@styled-system/css";
import { hstack, stack, visuallyHidden } from "@styled-system/patterns";
import { useForm } from "react-hook-form";
import Arrow from "./three_arrow_left.svg?url";
import Image from "next/image";
import { components } from "@/schema";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ProjectCategoryEditor } from "./ProjectCategoryEditor";
import { attributeSelectorStyle } from "@/common_components/project/ProjectAttributesBadge";
import { handleShareInviteLink } from "@/common_components/project/ProjectView";
export const runtime = "edge";

export const ProjectEditForm: React.FC<{ project: components["schemas"]["Project"] }> = ({ project }) => {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateProjectCommitteeSchemaType>({
    resolver: valibotResolver(UpdateProjectCommitteeSchema),
    defaultValues: project,
    mode: "onBlur",
  });

  const lableAndInputStyle = css({ fontWeight: "bold", "& > input": { fontWeight: "normal", marginTop: 2 } });
  const updateProject = async (data: UpdateProjectCommitteeSchemaType) => {
    if (!project) return;
    toast.promise(
      client
        .PUT("/projects/{project_id}", {
          params: {
            path: {
              project_id: project.id,
            },
          },
          body: data as components["schemas"]["UpdateProject"],
        })
        .then((res) => {
          if (res.error) {
            throw res.error;
          }
          router.push(`/committee/projects/${project.id}`);
        }),
      {
        loading: "変更を保存しています",
        success: "変更を保存しました",
        error: "変更を保存できませんでした",
      },
    );
  };

  return (
    <form className={stack({ gap: 4 })} onSubmit={handleSubmit(updateProject)}>
      <div className={hstack({ flexDirection: "row-reverse" })}>
        <Button color="purple" type="submit">
          保存
        </Button>
      </div>
      <label className={lableAndInputStyle}>
        企画名
        <input
          className={basicFormStyle()}
          placeholder="２０文字以内で入力"
          {...register("title", { value: project?.title })}
        />
        <p className={css({ color: "gray.400", fontWeight: "normal" })}>
          ※絵文字不可。半角全角英数字・半角記号は３字で仮名２文字にカウントします。
        </p>
        {errors.title && <span className={basicErrorMessageStyle}>{errors.title.message}</span>}
      </label>
      <label className={lableAndInputStyle}>
        企画名（ふりがな）
        <input
          className={basicFormStyle()}
          placeholder="２０文字以内で入力"
          {...register("kana_title", { value: project?.kana_title })}
        />
        {errors.kana_title && <span className={basicErrorMessageStyle}>{errors.kana_title.message}</span>}
      </label>
      <label className={lableAndInputStyle}>
        企画団体名
        <input className={basicFormStyle()} {...register("group_name", { value: project?.group_name })} />
        <p className={css({ color: "gray.400", fontWeight: "normal" })}>
          ※絵文字不可。半角全角英数字・半角記号は３字で仮名２文字にカウントします。
        </p>
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
      <section className={hstack({ justifyContent: "space-between", marginTop: 10 })}>
        <span className={css({ fontWeight: "bold", fontSize: "lg" })}>企画責任者</span>
        <div className={hstack()}>
          <span>{project?.owner_name}</span>
          <Image src={Arrow} alt="" />
          <Button type="button" color="secondary" onClick={async () => handleShareInviteLink(project.id, "owner")}>
            変更用URLを発行
          </Button>
        </div>
      </section>
      <section className={hstack({ justifyContent: "space-between" })}>
        <span className={css({ fontWeight: "bold", fontSize: "lg" })}>副企画責任者</span>
        <div className={hstack()}>
          <span>{project?.sub_owner_name ?? "未設定"}</span>
          <Image src={Arrow} alt="" />
          <Button type="button" color="secondary" onClick={async () => handleShareInviteLink(project.id, "sub_owner")}>
            変更用URLを発行
          </Button>
        </div>
      </section>
      <fieldset className={css({ marginTop: 10 })}>
        <div className={hstack({ marginBottom: 4 })}>
          <legend>企画区分</legend>
          <legend className={css({ fontSize: "sm", color: "gray.500", fontWeight: "bold" })}>
            どれか一つを選択してください
          </legend>
        </div>
        <ProjectCategoryEditor register={register("category", { value: project?.category })} />
      </fieldset>
      {errors.category && <span className={basicErrorMessageStyle}>{errors.category.message}</span>}
      <fieldset className={css({ marginTop: 5 })}>
        <div className={hstack({ marginBottom: 4 })}>
          <legend>企画属性</legend>
          <legend className={css({ fontSize: "sm", color: "gray.500", fontWeight: "bold" })}>
            当てはまるものをすべて選択してください
          </legend>
        </div>
        <div className={hstack()}>
          {projectAttributes.map((attribute) => (
            <label key={attribute} className={attributeSelectorStyle}>
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
      <fieldset className={css({ marginTop: 5 })}>
        <legend>企画実施場所番号</legend>
        <input
          type="number"
          {...register("location_id", { value: project?.location_id ?? "" })}
          className={basicFormStyle()}
        />
        {errors.location_id && <span className={basicErrorMessageStyle}>{errors.location_id.message}</span>}
      </fieldset>
    </form>
  );
};
