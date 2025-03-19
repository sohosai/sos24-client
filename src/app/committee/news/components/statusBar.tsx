import { css, cx } from "@styled-system/css";
//import { statusButtons } from "@/app/committee/news/components/statusButtons";

const statusBar = () => {
  return (
    <>
      <div
        className={css({
          columns: 4,
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          fontWeight: "bold",
          fontSize: "lg",
          paddingBottom: 2,
          borderBottom: "1px solid black",
        })}>
        <div>すべて</div>
        <div>下書き</div>
        <div>公開前</div>
        <div>公開済</div>
      </div>
    </>
  );
};
