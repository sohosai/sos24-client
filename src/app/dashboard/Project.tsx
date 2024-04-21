"use client";
import { vstack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { stack, hstack } from "@styled-system/patterns";
import { useState } from "react";
import { Button } from "@/common_components/Button";
import { ProjectTableView } from "@/common_components/project/ProjectView";
import { assignType } from "@/lib/openapi";
import useSWR from "swr";
import { basicErrorMessageStyle } from "@/common_components/formFields/styles";
import { RegistrationProgress } from "@/common_components/RegistrationProgress";
import formIcon from "@/assets/NotebookIcon.svg?url";
import warningIcon from "@/assets/Warning.svg?url";
import Image from "next/image";
import Link from "next/link";
import { components } from "@/schema";

interface Props {
  projectData: components["schemas"]["Project"];
}

export const Project: React.FC<Props> = ({ projectData }) => {
  const [editable, setEditable] = useState(false);
  let step: 1 | 2 | 3 | 4 | 5 = 2;

  const {
    data: rawFormData,
    error: formErr,
    isLoading: formIsLoading,
    // mutate: mutateForm,
  } = useSWR(true ? null : `/forms?project_id=${projectData.id}`);
  const formData = assignType("/forms", rawFormData);

  if (!formIsLoading && formData) {
    let hasAnsweredEveryForm = true;
    let hasAnsweredOathForm = false;
    for (const data of formData) {
      if (data.title === "誓約書提出フォーム") {
        hasAnsweredOathForm = data.answer_id !== null;
      } else if (data.answer_id === null) {
        hasAnsweredEveryForm = false;
      }
    }

    if (hasAnsweredEveryForm) {
      if (hasAnsweredOathForm) {
        step = projectData.sub_owner_id !== null ? 5 : 4;
      } else {
        step = 3;
      }
    } else {
      step = 2;
    }
  }

  return (
    <>
      <div className={vstack({})}>
        <div className={css({ textAlign: "center" })}>
          <p>締切は5月10日となっております</p>
          <p>締切日までにすべてのステップを完了済みにしてください。</p>
        </div>
        <RegistrationProgress step={step} />
      </div>
      <h3
        className={css({
          fontSize: "xl",
          fontWeight: "bold",
        })}>
        企画情報
      </h3>
      <div className={vstack({})}>
        {!editable && (
          <Button color="blue" className={css({ alignSelf: "end" })} onClick={() => setEditable((e) => !e)}>
            {editable ? "保存" : "編集"}する
          </Button>
        )}
        {true ? (
          "Loading"
        ) : (
          <>
            {false ? (
              <div className={basicErrorMessageStyle}>企画取得に失敗しました</div>
            ) : (
              <>
                <ProjectTableView
                  isEditMode={editable}
                  onSubmit={() => {
                    // mutateProject(rawProjectData);
                    setEditable(false);
                  }}
                  projectData={projectData}
                />
              </>
            )}
          </>
        )}
      </div>
      <div
        className={stack({
          width: "4/5",
          flex: 1,
          gap: 6,
          md: {
            alignItems: "center",
          },
          maxWidth: "2xl",
        })}>
        {formErr ? (
          <div className={basicErrorMessageStyle}>申請フォームの取得に失敗しました</div>
        ) : formIsLoading || !formData ? (
          "Loading"
        ) : (
          formData.map((data) => (
            <FormItem id={data.id} title={data.title} done={data.answer_id !== null} key={data.id} />
          ))
        )}
      </div>
    </>
  );
};

interface FormItemProps {
  id: string;
  title: string;
  done?: boolean;
}

const FormItem = ({ id, title, done = false }: FormItemProps) => {
  return (
    <Link href={`/forms/${id}`} className={css({ display: "block", width: "100%", position: "relative" })}>
      {done || (
        <div
          className={css({
            position: "absolute",
            top: -3,
            left: 0,
          })}>
          <Image src={warningIcon} alt="" />
        </div>
      )}
      <div
        className={hstack({
          width: "full",
          gap: 4,
          borderWidth: 3,
          borderStyle: "solid",
          borderRadius: 9,
          paddingX: 4,
          paddingY: 4,

          cursor: "pointer",
          borderColor: "gray.400",
          transition: "all 0.2s",
          "&:hover": {
            background: "gray.200",
          },
        })}>
        <Image src={formIcon} alt="" />
        <span
          className={css({
            fontSize: "md",
            fontWeight: "bold",
          })}>
          {title}
        </span>
      </div>
    </Link>
  );
};
