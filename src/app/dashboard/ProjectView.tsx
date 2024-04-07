import { basicErrorMessageStyle, basicFormStyle } from "@/components/forms/styles";
import { categoryToLabel } from "@/components/news/CategoryBadges";
import { ProjectAttributesBadge } from "@/components/project/AttirbutesBadge";
import { assignType, client } from "@/lib/openapi";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { UpdateProjectSchema, UpdateProjectSchemaType } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import toast from "react-hot-toast";
import { Button } from "@/components/Button";
import { grid, vstack } from "@styled-system/patterns";
import { css, cx } from "@styled-system/css";
import { ReactNode } from "react";
const tableCellStyle = css({
  paddingX: 14,
  paddingY: 4,
  alignSelf: "center",
});

export const TableRow = ({ label, children, formId }: { label: ReactNode; children: ReactNode; formId?: string }) => (
  <div
    className={grid({
      columns: 2,
      _even: {
        backgroundColor: "gray.100",
      },
      borderRadius: "md",
    })}>
    <label htmlFor={formId} className={cx(tableCellStyle, css({ fontWeight: "bold" }))}>
      {label}
    </label>
    <div className={tableCellStyle}>{children}</div>
  </div>
);

export const handleCopyInviteLink = async (project_id: string, position: "owner" | "sub_owner") => {
  let data: ClipboardItem[] = [];
  const inviteId = localStorage.getItem("invite-id");
  const { data: dataFromAPI, error } = await client.GET("/invitations/{invitation_id}", {
    params: { path: { invitation_id: inviteId ?? "" } },
  });

  let idIsValid = false;
  if (inviteId && !error) {
    const invitation = assignType("/invitations/{invitation_id}", dataFromAPI);
    if (!invitation.used_by) {
      idIsValid = true;
    }
    data = [
      new ClipboardItem({
        "text/plain": new Blob([`${document.location.origin}/invitations/${inviteId}`], { type: "text/plain" }),
      }),
    ];
  }
  if (!idIsValid) {
    client
      .POST("/invitations", {
        body: {
          project_id,
          position,
        },
      })
      .then((res) => {
        data = [
          new ClipboardItem({
            "text/plain": new Blob([`${document.location.origin}/invitations/${res.data?.id}`], { type: "text/plain" }),
          }),
        ];
        localStorage.setItem("invite-id", res.data?.id ?? "");
      })
      .catch((e) => {
        toast.error("招待リンクの作成に失敗しました");
        throw new Error(e);
      });
  }
  navigator.clipboard
    .write(data)
    .then(() => {
      toast.success("招待リンクをコピーしました");
    })
    .catch(() => {
      toast.error("招待リンクのコピーに失敗しました");
    });
};
export const ProjectView: React.FC<{ isEditMode: boolean; onSubmit: () => void; hideSubOwner?: boolean }> = ({
  isEditMode,
  onSubmit,
  hideSubOwner = false,
}) => {
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
      .then(({ error }) => {
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
                        placeholder="２０文字以内で入力"
                        {...register("kana_title", {
                          value: projectData.kana_title ?? "",
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
                          value: projectData.group_name ?? "",
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
                    {projectData.sub_owner_name ?? (
                      <button
                        className={css({ color: "sohosai.purple", textDecoration: "underline", cursor: "pointer" })}
                        onClick={() => handleCopyInviteLink(projectData.id, "sub_owner")}
                        type="button">
                        招待リンクをコピー
                      </button>
                    )}
                  </TableRow>
                )}
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
