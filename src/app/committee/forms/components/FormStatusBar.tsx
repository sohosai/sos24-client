import { css } from "@styled-system/css";
import { FormStatusButton } from "@/app/committee/forms/components/FormStatusButton";
import { useRouter } from "next/navigation";

interface SortStatus {
  SortStatus: "all" | "draft" | "before_reception" | "accepting" | "ended";
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
          color={SortStatus === "draft" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/news/draft`);
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
          color={SortStatus === "before_reception" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/news/scheduled`);
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
          color={SortStatus === "accepting" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/news/published`);
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
          color={SortStatus === "ended" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/news`);
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
