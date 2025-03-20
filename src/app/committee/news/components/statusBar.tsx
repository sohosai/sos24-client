import { css } from "@styled-system/css";
import { useState } from "react";
import { StatusButton } from "@/app/committee/news/components/statusButtons";
import { useRouter } from "next/navigation";

type Status = "all" | "draft" | "scheduled" | "published";

export const NewsStatusBar = () => {
  const router = useRouter();
  const [status] = useState<Status>("all");
  return (
    <>
      <div
        className={css({
          display: "flex",
          columns: 4,
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          fontWeight: "bold",
          fontSize: "lg",
          paddingBottom: 2,
          borderBottom: "1px solid ",
          borderColor: "gray.500",
        })}>
        <StatusButton
          type="button"
          color={status === "all" ? "black" : "purple"}
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
          color={status === "draft" ? "black" : "purple"}
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
          color={status === "scheduled" ? "black" : "purple"}
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
          color={status === "published" ? "black" : "purple"}
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
