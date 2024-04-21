"use client";
import { vstack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { useState } from "react";
import { Button } from "@/common_components/Button";
import { ProjectTableView } from "@/common_components/project/ProjectView";
import { basicErrorMessageStyle } from "@/common_components/formFields/styles";
import { RegistrationProgress } from "@/common_components/RegistrationProgress";
import { components } from "@/schema";

interface Props {
  projectData: components["schemas"]["Project"];
  step: 1 | 2 | 3 | 4 | 5;
}

export const Project: React.FC<Props> = ({ projectData, step }) => {
  const [editable, setEditable] = useState(false);

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
      </div>
      {/* <div */}
      {/*   className={stack({ */}
      {/*     width: "4/5", */}
      {/*     flex: 1, */}
      {/*     gap: 6, */}
      {/*     md: { */}
      {/*       alignItems: "center", */}
      {/*     }, */}
      {/*     maxWidth: "2xl", */}
      {/*   })}> */}
      {/*   {formErr ? ( */}
      {/*     <div className={basicErrorMessageStyle}>申請フォームの取得に失敗しました</div> */}
      {/*   ) : formIsLoading || !formData ? ( */}
      {/*     "Loading" */}
      {/*   ) : ( */}
      {/*     formData.map((data) => ( */}
      {/*       <FormItem id={data.id} title={data.title} done={data.answer_id !== null} key={data.id} /> */}
      {/*     )) */}
      {/*   )} */}
      {/* </div> */}
    </>
  );
};
