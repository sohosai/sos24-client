import { basicErrorMessageStyle, basicFormStyle } from "@/common_components/formFields/styles";
import { ProjectAttributesBadge } from "@/common_components/project/AttirbutesBadge";
import { assignType, client } from "@/lib/openapi";
import { useForm } from "react-hook-form";
import { UpdateProjectSchema, UpdateProjectSchemaType } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import toast from "react-hot-toast";
import { Button } from "@/common_components/Button";
import { vstack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import React from "react";
import { ProjectCategoryFormatter } from "@/common_components/ProjectCategoryFormatter";
import { components } from "@/schema";
import { TableRow } from "@/app/dashboard/TableRow";
import { UserWithAddress } from "./UserWithAddress";

export const shareURL = async (url: string) => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      toast.success("リンクをコピーしました");
    })
    .catch(() => {
      navigator
        .share({
          url,
        })
        .catch(() => {
          toast.error("リンクを共有できませんでした");
        });
    });
};

export const getNewInvitationId = async (
  project_id: string,
  position: components["schemas"]["Invitation"]["position"],
) => {
  const res = await client.POST("/invitations", {
    body: {
      project_id,
      position,
    },
  });
  if (res.error) {
    throw res.error;
  }
  localStorage.setItem("invitation_id", res.data.id ?? "");
  return res.data.id;
};

const getInvitationIdWithCache = async (
  project_id: string,
  position: components["schemas"]["Invitation"]["position"],
): Promise<string> => {
  const invitationId = localStorage.getItem("invitation_id");

  if (!invitationId) {
    return await getNewInvitationId(project_id, position);
  }

  const { data: dataFromAPI, error } = await client.GET("/invitations/{invitation_id}", {
    params: { path: { invitation_id: invitationId ?? "" } },
  });

  if (!error && !assignType("/invitations/{invitation_id}", dataFromAPI).used_by) {
    return invitationId;
  } else {
    return await getNewInvitationId(project_id, position);
  }
};

export const handleShareInviteLink = async (
  project_id: string,
  position: "owner" | "sub_owner",
  useCache?: boolean,
) => {
  const invitationId = useCache
    ? await getInvitationIdWithCache(project_id, position)
    : await getNewInvitationId(project_id, position);
  shareURL(`${window.location.origin}/invitations/${invitationId}`);
};

export const ProjectTableView: React.FC<{
  isEditMode?: boolean;
  onSubmit?: () => unknown;
  hideSubOwner?: boolean;
  projectData: components["schemas"]["Project"];
  isCommittee?: boolean;
}> = ({ isEditMode = false, onSubmit = () => {}, hideSubOwner = false, projectData, isCommittee = false }) => {
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
      .then(({ error }) => {
        if (error) {
          toast.error("企画情報が更新できませんでした");
          if (error["code"] == "bounded-string/invalid-character") {
            setError("title", { message: "絵文字は使えません" });
          }
          return;
        }
        toast.success("企画情報を更新しました");
        onSubmit();
      });
  };
  return (
    <form className={vstack({ width: "full" })} onSubmit={handleSubmit(submitForm)}>
      <div>
        <TableRow label="企画番号">{`00${projectData.index}`.slice(-3)}</TableRow>
        <TableRow label="企画名" formId="title">
          {isEditMode ? (
            <>
              <input
                type="text"
                id="title"
                {...register("title", {
                  value: projectData.title ?? "",
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
                {...register("kana_title", {
                  value: projectData.kana_title ?? "",
                })}
                className={isEditMode ? basicFormStyle() : ""}
              />
              {errors.kana_title && <span className={basicErrorMessageStyle}>{errors.kana_title?.message}</span>}
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
                {...register("group_name", {
                  value: projectData.group_name ?? "",
                })}
                className={isEditMode ? basicFormStyle() : ""}
              />
              {errors.group_name && <span className={basicErrorMessageStyle}>{errors.group_name?.message}</span>}
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
                {...register("kana_group_name", {
                  value: projectData.kana_group_name ?? "",
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
        <TableRow label="企画責任者">
          <UserWithAddress name={projectData.owner_name} email={projectData.owner_email} />
        </TableRow>
        {/*企画応募画面で誓約書提出を副責任者登録より前にやってもらうため*/}
        {hideSubOwner ? null : (
          <TableRow
            label={
              <span
                className={css(
                  !projectData.sub_owner_name && {
                    position: "relative",
                    _after: {
                      content: '""',
                      position: "absolute",
                      top: "-50%",
                      right: "-20%",
                      width: 3,
                      height: 3,
                      backgroundColor: "error",
                      borderRadius: "full",
                      display: "block",
                    },
                  },
                )}>
                副企画責任者
              </span>
            }>
            {projectData.sub_owner_name && projectData.sub_owner_email ? (
              <UserWithAddress name={projectData.sub_owner_name} email={projectData.sub_owner_email} />
            ) : (
              <button
                className={css({ color: "sohosai.purple", textDecoration: "underline", cursor: "pointer" })}
                onClick={() => handleShareInviteLink(projectData.id, "sub_owner", !isCommittee)}
                type="button">
                招待リンクを共有
              </button>
            )}
          </TableRow>
        )}
        <TableRow label="企画区分" formId="category">
          <ProjectCategoryFormatter category={projectData.category} />
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
  );
};
