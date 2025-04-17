import { css } from "@styled-system/css";
import { StatusButton } from "@/app/committee/news/components/statusButtons";
import { useRouter } from "next/navigation";

interface SortStatus {
  SortStatus: "all" | "draft" | "scheduled" | "published";
}

export const NewsStatusBar: React.FC<SortStatus> = ({ SortStatus }) => {
  const router = useRouter();

  return (
    <>
      <div
        className={css({
          display: "flex",
          columns: 4,
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          fontWeight: "bold",
          fontSize: "lg",
          marginY: 4,
          borderBottom: "2px solid ",
          borderColor: "gray.200",
        })}>
        <StatusButton
          type="button"
          color={SortStatus === "all" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/news`);
          }}>
          <span
            className={css({
              fontWeight: "bold",
              borderColor: "white",
            })}>
            すべて
          </span>
        </StatusButton>

        <StatusButton
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
        </StatusButton>

        <StatusButton
          type="button"
          color={SortStatus === "scheduled" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/news/scheduled`);
          }}>
          <span
            className={css({
              fontWeight: "bold",
              borderColor: "white",
            })}>
            公開前
          </span>
        </StatusButton>

        <StatusButton
          type="button"
          color={SortStatus === "published" ? "purple" : "black"}
          onClick={() => {
            router.push(`/committee/news/published`);
          }}>
          <span
            className={css({
              fontWeight: "bold",
              borderColor: "white",
            })}>
            公開済
          </span>
        </StatusButton>
      </div>
    </>
  );
};
