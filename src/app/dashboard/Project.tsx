import { vstack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { useState } from "react";
import { Button } from "@/common_components/Button";
import { ProjectTableView } from "@/common_components/project/ProjectView";
import { RegistrationProgress } from "@/common_components/RegistrationProgress";
import { components } from "@/schema";

interface Props {
  projectData: components["schemas"]["Project"];
  mutation: () => void;
  step: 1 | 2 | 3 | 4 | 5;
}

export const Project: React.FC<Props> = ({ projectData, mutation, step }) => {
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
        <ProjectTableView
          isEditMode={editable}
          onSubmit={() => {
            mutation();
            setEditable(false);
          }}
          projectData={projectData}
        />
      </div>
    </>
  );
};
