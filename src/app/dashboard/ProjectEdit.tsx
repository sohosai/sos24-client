import { basicErrorMessageStyle, basicFormStyle } from "@/components/forms/styles";
import { categoryToLabel } from "@/components/news/CategoryBadges";
import { ProjectAttributesBadge } from "@/components/project/AttirbutesBadge";
import { assignType, client } from "@/lib/openapi";
import useSWR from "swr";
import { TableRow, handleCopyInviteLink } from "./ProjectView";
import { css, cx } from "@styled-system/css";
import { useForm } from "react-hook-form";
import { UpdateProjectSchema, UpdateProjectSchemaType } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/Button";
import { center, vstack } from "@styled-system/patterns";

export const ProjectEdit: React.FC<{ isEditMode: boolean; onSubmit: () => void }> = ({ isEditMode, onSubmit }) => {
  const {
    data: rawProjectData,
    error: projectErr,
    isLoading: projectIsLoading,
    mutate: mutateProject,
  } = useSWR("/projects/me");
  const projectData = assignType("/projects/me", rawProjectData);
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<UpdateProjectSchemaType>({
    resolver: valibotResolver(UpdateProjectSchema),
  });
  const submitForm = async (e: UpdateProjectSchemaType) => {
    await client
      .PUT(`/projects/{project_id}`, {
        params: {
          path: {
            project_id: projectData.id,
          },
        },
        body: { ...projectData, ...e },
      })
      .then(({ data, error }) => {
        if (error) {
          toast.error("企画情報が更新できませんでした");
          if (error["code"] == "bounded-string/invalid-character") {
            setError("title", { message: "絵文字は使えません" });
          }
          return;
        }
        toast.success("企画情報を更新しました");
        mutateProject({ ...projectData });
        onSubmit();
      });
  };
  return (
    <>
      {projectIsLoading ? (
        "Loading"
      ) : (
        <>
          {projectErr ? (
            <div className={basicErrorMessageStyle}>企画取得に失敗しました</div>
          ) : (
            <form className={vstack({ width: "2xl" })} onSubmit={handleSubmit(submitForm)}>
              <div>
                <TableRow label="企画名" formId="title">
                  {isEditMode ? (
                    <>
                      <input
                        type="text"
                        id="title"
                        placeholder="２０文字以内で入力"
                        {...register("title", {
                          value: projectData.title,
                        })}
                        className={isEditMode ? basicFormStyle() : ""}
                      />
                      {errors.title && <span className={basicErrorMessageStyle}>{errors.title?.message}</span>}
                    </>
                  ) : (
                    projectData.title
                  )}
                </TableRow>
                <TableRow label="企画名（ふりがな）" formId="kana_title">
                  {isEditMode ? (
                    <>
                      <input
                        type="text"
                        id="kana_title"
                        placeholder="２０文字以内で入力"
                        {...register("kana_title", {
                          value: projectData.kana_title,
                        })}
                        className={isEditMode ? basicFormStyle() : ""}
                      />
                      {errors.kana_title && (
                        <span className={basicErrorMessageStyle}>{errors.kana_title?.message}</span>
                      )}
                    </>
                  ) : (
                    projectData.kana_title
                  )}
                </TableRow>
                <TableRow label="企画団体名" formId="group_name">
                  {isEditMode ? (
                    <>
                      <input
                        type="text"
                        id="group_name"
                        placeholder="２０文字以内で入力"
                        {...register("group_name", {
                          value: projectData.group_name,
                        })}
                        className={isEditMode ? basicFormStyle() : ""}
                      />
                      {errors.group_name && (
                        <span className={basicErrorMessageStyle}>{errors.group_name?.message}</span>
                      )}
                    </>
                  ) : (
                    projectData.group_name
                  )}
                </TableRow>
                <TableRow label="企画団体名（ふりがな）" formId="kana_group_name">
                  {isEditMode ? (
                    <>
                      <input
                        type="text"
                        id="kana_group_name"
                        placeholder="２０文字以内で入力"
                        {...register("kana_group_name", {
                          value: projectData.kana_group_name,
                        })}
                        className={isEditMode ? basicFormStyle() : ""}
                      />
                      {errors.kana_group_name && (
                        <span className={basicErrorMessageStyle}>{errors.kana_group_name?.message}</span>
                      )}
                    </>
                  ) : (
                    projectData.kana_group_name
                  )}
                </TableRow>
                {/*企画応募画面で誓約書提出を副責任者登録より前にやってもらうため*/}
                <TableRow label="企画区分" formId="category">
                  {categoryToLabel(projectData.category)}
                </TableRow>
                <TableRow label="企画属性" formId="attributes">
                  {<ProjectAttributesBadge attributes={projectData.attributes} />}
                </TableRow>
              </div>
              {isEditMode && (
                <Button type="submit" color="blue">
                  更新
                </Button>
              )}
            </form>
          )}
        </>
      )}
    </>
  );
};
