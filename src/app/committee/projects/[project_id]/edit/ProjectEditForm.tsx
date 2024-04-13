"use client";
import { Button } from "@/components/Button";
import { basicErrorMessageStyle, basicFormStyle } from "@/components/formFields/styles";
import { AttributesFormatter } from "@/components/project/AttributesFormatter";
import { client } from "@/lib/openapi";
import { UpdateProjectCommitteeSchema, UpdateProjectCommitteeSchemaType, projectAttributes } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { css } from "@styled-system/css";
import { hstack, stack, visuallyHidden } from "@styled-system/patterns";
import { useForm } from "react-hook-form";
import Arrow from "./three_arrow_left.svg";
import Image from "next/image";
import { getNewInvitationId, shareURL } from "@/components/project/ProjectView";
import { components } from "@/schema";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ProjectCategoryEditor } from "./ProjectCategoryEditor";
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
  });

  const lableAndInputStyle = css({ fontWeight: "bold", "& > input": { fontWeight: "normal", marginTop: 2 } });
  const updateProject = async (data: UpdateProjectCommitteeSchemaType) => {
    if (!project) return;
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
          toast.error("変更を保存できませんでした");
          return;
        }
        toast.success("変更を保存しました");
        router.push(`/committee/projects/${project.id}`);
      })
      .catch(() => toast.error("変更を保存できませんでした"));
  };

  return (
    <form className={stack({ gap: 4 })} onSubmit={handleSubmit(updateProject)}>
      <div className={hstack({ flexDirection: "row-reverse" })}>
        <Button color="primary" type="submit">
          保存
        </Button>
      </div>
      <label className={lableAndInputStyle}>
        企画名
        <input
          className={basicFormStyle()}
          placeholder="20文字以内で入力"
          {...register("title", { value: project?.title })}
        />
        <span className={css({ color: "gray.400", fontWeight: "normal" })}>
          ※絵文字不可。半角全角英数字・半角記号は３字で仮名２文字にカウントします。
        </span>
        {errors.title && <span className={basicErrorMessageStyle}>{errors.title.message}</span>}
      </label>
      <label className={lableAndInputStyle}>
        企画名（ふりがな）
        <input
          className={basicFormStyle()}
          placeholder="20文字以内で入力"
          {...register("kana_title", { value: project?.kana_title })}
        />
        {errors.kana_title && <span className={basicErrorMessageStyle}>{errors.kana_title.message}</span>}
      </label>
      <label className={lableAndInputStyle}>
        企画団体名
        <input className={basicFormStyle()} {...register("group_name", { value: project?.group_name })} />
        <span className={css({ color: "gray.400", fontWeight: "normal" })}>
          ※絵文字不可。半角全角英数字・半角記号は３字で仮名２文字にカウントします。
        </span>
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
          <Button
            type="button"
            color="secondary"
            onClick={async () =>
              shareURL(`${window.location.origin}/invitation/${await getNewInvitationId(project.id, "owner")}`)
            }>
            変更用URLを発行
          </Button>
        </div>
      </section>
      <section className={hstack({ justifyContent: "space-between" })}>
        <span className={css({ fontWeight: "bold", fontSize: "lg" })}>副企画責任者</span>
        <div className={hstack()}>
          <span>{project?.sub_owner_name ?? "未設定"}</span>
          <Image src={Arrow} alt="" />
          <Button
            type="button"
            color="secondary"
            onClick={async () => shareURL(await getNewInvitationId(project.id, "sub_owner"))}>
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
    </form>
  );
};