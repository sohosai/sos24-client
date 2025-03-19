import { css } from "@styled-system/css";

import { StatusButton } from "@/app/committee/news/components/statusButtons";
import { useRouter } from "next/navigation";

export const NewsStatusBar = () => {
  const router = useRouter();
  return (
    <>
      <div
        className={css({
          columns: 4,
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          fontWeight: "bold",
          fontSize: "lg",
          paddingBottom: 2,
          borderBottom: "3px solid black",
          marginX: 0,
          width: "full",
          py: 4,
        })}>
        <div
          className={css({
            px: 0,
          })}>
          <StatusButton
            type="button"
            onClick={() => {
              router.push(`/committee/news/all`);
            }}>
            <span
              className={css({
                fontWeight: "bold",
                borderColor: "white",
              })}>
              すべて
            </span>
          </StatusButton>
        </div>
        <div>
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
        </div>
        <div>
          <StatusButton
            type="button"
            onClick={() => {
              router.push(`/committee/news/koukaimae`);
            }}>
            <span
              className={css({
                fontWeight: "bold",
                borderColor: "white",
              })}>
              公開前
            </span>
          </StatusButton>
        </div>
        <div>
          <StatusButton
            type="button"
            onClick={() => {
              router.push(`/committee/news/koukazumi`);
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
      </div>
    </>
  );
};
