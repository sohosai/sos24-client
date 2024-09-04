import { hstack, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { Button } from "@/common_components/Button";
import Image from "next/image";
import sendIcon from "@/assets/Send.svg?url";
import { NewNewsSchema, NewNewsSchemaType, projectAttributes, projectCategories, ProjectCategory } from "@/lib/valibot";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { client } from "@/lib/openapi";
import { components } from "@/schema";
import toast from "react-hot-toast";
import { ProjectCategorySelector } from "@/common_components/ProjectCategorySelector";
import { TitleField } from "@/common_components/news/TitleField";
import { BodyField } from "@/common_components/news/BodyField";
import { useEffect, useState, FC } from "react";
import { FileErrorsType } from "@/common_components/form_answer/FormItems";
import { FilesField } from "@/common_components/form_editor/FilesEditor";
import { filesStatus } from "@/common_components/form_editor/FilesInterfaces";
import pageStyle from "./NewNewsForm.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "dayjs/locale/ja";
dayjs.locale("ja");

import CheckIcon from "./_checkIcon.svg?url";
import TrashIcon from "./_trashBtnIcon.svg?url";
import SelectArrow from "./_optionsArrow.svg?url";

interface NewsProps {
  uid: string;
  title: string;
  body: string;
  categories: string[];
  attachments: filesStatus[];
  updatedAt: string;
}

export const NewNewsForm: FC<{
  draft: string;
}> = ({ draft }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<NewNewsSchemaType>({
    mode: "onBlur",
    resolver: valibotResolver(NewNewsSchema),
  });
  const [filesStatus, setFilesStatus] = useState<filesStatus[]>([]);
  const [fileErrors, setFileErrors] = useState<FileErrorsType>(new Map([["attachments", null]]));
  type FileIds = { [itemId: string]: string[] };

  const [drafts, setDrafts] = useState<NewsProps[] | null>(null);
  const [drafts_loaded, setDraftsLoaded] = useState<boolean>(false);
  useEffect(() => {
    const item: string | null = localStorage.getItem("sos_news_drafts");
    if (item) {
      setDrafts(JSON.parse(item) ?? null);
      if (draft) {
        JSON.parse(item).forEach((draft_items: NewsProps) => {
          if (draft_items?.uid === draft) {
            // console.log("Found draft", draft_items);
            setTitle(draft_items.title ?? "");
            setBody(draft_items.body ?? "");
            setCategories((draft_items.categories as ProjectCategory[]) ?? []);
            setFilesStatus(draft_items?.attachments ?? []);
          }
        });
      }
      setDraftsLoaded(true);
    } else {
      setDrafts([]);
      setDraftsLoaded(true);
    }
  }, []);
  // useEffect(() => {
  //   if (drafts && drafts.length > 0) {
  //     console.log("drafts", drafts);
  //   }
  // }, [drafts]);
  useEffect(() => {
    if (drafts) {
      if (drafts_loaded) {
        localStorage.setItem("sos_news_drafts", JSON.stringify(drafts));
        // console.log("Drafts saved to localStorage", drafts);
        // } else {
        // console.log("load されていないので保存できません", drafts);
      }
    }
  }, [drafts]);

  // const [draftUID, setDraftUID] = useState<string>(Math.random().toString(32).substring(2));
  const [draftUID, setDraftUID] = useState<string>(draft ?? Math.random().toString(32).substring(2));
  useEffect(() => {
    // console.log(`${draftUID} になりました`);
    if (draftUID && !draft) {
      router.replace(`/committee/news/new/${draftUID}`);
    }
  }, [draftUID]);

  const onSubmit = async (data: NewNewsSchemaType) => {
    if (fileErrors.get("attachments")) {
      toast.error("添付ファイルを正しく選択してください");
      return;
    }
    let fileIds: FileIds = { attachments: filesStatus.map((fileStatus) => fileStatus.uuid) };
    const categories = data.categories === false ? projectCategories : data.categories;

    await toast.promise(
      client
        .POST("/news", {
          body: {
            title: data.title,
            body: data.body,
            categories: categories as components["schemas"]["ProjectCategory"][],
            attributes: [...projectAttributes] as components["schemas"]["ProjectAttribute"][],
            attachments: fileIds["attachments"] ?? [],
          },
        })
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }
          router.push(`/committee/news/${data.id}`);
        }),
      {
        loading: "お知らせを作成しています",
        error: "お知らせの作成中にエラーが発生しました",
        success: "お知らせを作成しました",
      },
    );
  };

  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  useEffect(() => {
    updateSome();
  }, [categories, title, body, filesStatus]);
  const updateSome = () => {
    drafts_loaded &&
      setDrafts([
        ...(drafts?.filter((draft) => {
          return draft.uid !== draftUID;
        }) ?? []),
        {
          uid: draftUID,
          title: title,
          body: body,
          categories: categories,
          attachments: filesStatus,
          updatedAt: new Date().toISOString(),
        },
      ]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={stack({ gap: 4, marginBottom: "100px" })}>
      <div
        className={hstack({
          justifyContent: "space-between",
          marginBottom: 2,
        })}>
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>新規お知らせ作成</h2>
        <Button
          type="submit"
          color="purple"
          className={hstack({
            gap: 3,
          })}
          disabled={isSubmitting || isSubmitSuccessful}>
          <span
            className={css({
              fontSize: "xs",
              fontWeight: "bold",
            })}>
            送信
          </span>
          <Image src={sendIcon} alt="" />
        </Button>
      </div>
      {drafts && drafts.length > 0 && (
        <div className={pageStyle.draftsWrap}>
          <div className={pageStyle.display}>
            <div className={pageStyle.statusWrap}>
              {drafts_loaded && drafts.find((draft_item: NewsProps) => draft_item.uid === draftUID) ? (
                <>
                  <Image src={CheckIcon} className={pageStyle.statusIcon} alt="" />
                  <span>ローカルに保存済み</span>
                </>
              ) : (
                <span>保存されていません</span>
              )}
            </div>
            <p className={pageStyle.note}>他のブラウザには同期されません</p>
          </div>
          <div className={pageStyle.actions}>
            <div
              className={pageStyle.btn}
              onClick={() => {
                setDrafts(
                  drafts?.filter((draft_item: NewsProps) => {
                    return draft_item.uid !== draftUID;
                  }),
                );
                router.push(`/committee/news/new`);
              }}>
              <Image src={TrashIcon} className={pageStyle.btn__icon} alt="" />
            </div>
            <div className={pageStyle.selectsWrap}>
              <select
                value={draftUID}
                onChange={(e) => {
                  router.push(`/committee/news/new/${e.target.value}`);
                  setDraftUID(e.target.value);
                }}
                className={pageStyle.selects}>
                <option value="">新規作成</option>
                {drafts?.map((draft_item: NewsProps) => (
                  <option key={draft_item.uid} value={draft_item.uid} selected={draft_item.uid === draft}>
                    {draft_item.title !== "" ? draft_item.title : "無題"} -{" "}
                    {draft_item.updatedAt && dayjs(draft_item.updatedAt).fromNow()}
                  </option>
                ))}
              </select>
              <Image src={SelectArrow} alt="" className={pageStyle.arrow} />
            </div>
          </div>
        </div>
      )}
      <ProjectCategorySelector
        register={register("categories", {
          onChange: (e) => {
            if (e.target.checked) {
              setCategories([...categories, e.target.value]);
              // console.log("Add Cat:", e.target.value);
            } else {
              setCategories(categories.filter((item) => item !== e.target.value));
              // console.log("Remove Cat:", e.target.value);
            }
            updateSome();
          },
        })}
        checkedCategories={categories}
        error={errors.categories?.message}
      />
      <TitleField
        register={register("title", {
          onChange: (e) => {
            // console.log("Custom onChange Title:", e.target.value);
            setTitle(e.target.value);
          },
        })}
        error={errors.title?.message}
        value={title}
      />
      <BodyField
        register={register("body", {
          onChange: (e) => {
            // console.log("Custom onChange Body:", e.target.value);
            setBody(e.target.value);
          },
        })}
        error={errors.body?.message}
        value={body}
      />
      <FilesField
        label="添付ファイル"
        register={register("attachments", {
          onChange: (e) => {
            // console.log("Custom onChange Attachment:", e.target.value);
          },
        })}
        id="attachments"
        filesStatus={filesStatus}
        setFilesStatus={setFilesStatus}
        setErrorState={setFileErrors}
      />
      <p
        className={css({
          color: "gray.500",
          fontSize: "sm",
          mt: "50px",
        })}>
        <b>ご利用上の注意事項：</b>
        重要なお知らせの下書きは、必ずご自身で管理してください。（下書き機能による保存内容の安全性は保証されません。）なお、下書きはブラウザのローカルストレージに保存され、他のブラウザやデバイスには同期されません。共有デバイス等信頼できないデバイスでは、必ず「サインアウト」を行ってください。
      </p>
    </form>
  );
};
