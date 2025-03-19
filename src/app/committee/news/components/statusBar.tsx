import { css } from "@styled-system/css";

import { StatusButton } from "@/app/committee/news/components/statusButtons";
import { useRouter } from "next/navigation";

export const NewsStatusBar = () => {
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
          paddingBottom: 2,
          borderBottom: "1px solid ",
          borderColor: "gray.500",
        })}>
        <StatusButton
          type="button"
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
