import { css } from "@styled-system/css";
import { FormStatusButton } from "@/app/committee/forms/components/FormStatusButton";
import { useRouter } from "next/navigation";

interface SortStatus {
  SortStatus: "開始前" | "下書き" | "受付中" | "受付終了" | "all";
}

export const FormStatusBar: React.FC<SortStatus> = ({ SortStatus }) => {
  const router = useRouter();

  return (
    <>
      <div
        className={css({
          display: "flex",
          columns: 4,
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          fontWeight: "bold",
          fontSize: "lg",
          marginY: 4,
          borderBottom: "2px solid ",
          borderColor: "gray.200",
        })}>
        <FormStatusButton
          type="button"
          color={SortStatus === "all" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/forms`);
          }}>
          <span
            className={css({
              fontWeight: "bold",
              borderColor: "white",
            })}>
            すべて
          </span>
        </FormStatusButton>

        <FormStatusButton
          type="button"
          color={SortStatus === "下書き" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/forms/draft`);
          }}>
          <span
            className={css({
              fontWeight: "bold",
              borderColor: "white",
            })}>
            下書き
          </span>
        </FormStatusButton>

        <FormStatusButton
          type="button"
          color={SortStatus === "開始前" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/forms/Beforehand`);
          }}>
          <span
            className={css({
              fontWeight: "bold",
              borderColor: "white",
            })}>
            開始前
          </span>
        </FormStatusButton>

        <FormStatusButton
          type="button"
          color={SortStatus === "受付中" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/forms/accepting`);
          }}>
          <span
            className={css({
              fontWeight: "bold",
              borderColor: "white",
            })}>
            受付中
          </span>
        </FormStatusButton>

        <FormStatusButton
          type="button"
          color={SortStatus === "受付終了" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/forms/ended`);
          }}>
          <span
            className={css({
              fontWeight: "bold",
              borderColor: "white",
            })}>
            受付終了
          </span>
        </FormStatusButton>
      </div>
    </>
  );
};
