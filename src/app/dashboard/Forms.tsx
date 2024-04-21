import { components } from "@/schema";
import { stack } from "@styled-system/patterns";

interface Props {
  projectData: components["schemas"]["Project"];
}

export const Forms: React.FC<Props> = ({ projectData }) => {
  return (
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
      {/* {false ? ( */}
      {/*   <div className={basicErrorMessageStyle}>申請フォームの取得に失敗しました</div> */}
      {/* ) : formIsLoading || !formData ? ( */}
      {/*   "Loading" */}
      {/* ) : ( */}
      {/*   formData.map((data) => ( */}
      {/*     <FormItem id={data.id} title={data.title} done={data.answer_id !== null} key={data.id} /> */}
      {/*   )) */}
      {/* )} */}
    </div>
  );
};
