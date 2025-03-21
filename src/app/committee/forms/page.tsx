"use client";

import { css } from "@styled-system/css";
import { NextPage } from "next";
import { FormsList } from "./FormsList";
import { stack } from "@styled-system/patterns";
import { assignType } from "@/lib/openapi";
import useSWR from "swr";


const DashboardPage: NextPage = () => {
  const { data: formsRes, error, isLoading } = useSWR(() => `/forms`);
  const forms = formsRes ? assignType("/forms", formsRes) : undefined;

  if (isLoading) {
    return (
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "85vh",
        })}>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !forms) {
    return (
      <p>
        申請の取得中にエラーが発生しました
        <span>({String(error)})</span>
      </p>
    );
  }

  return (
    <>
      <div
        className={css({
          padding: 5,
          maxWidth: "900px",
          marginInline: "auto",
        })}>
        <div>
          <h2
            className={css({
              fontSize: "xl",
              fontWeight: "bold",
              display: "flex",
              gap: 1,
            })}>
            申請一覧
          </h2>
        </div>
        <div className={stack({ padding: 10, gap: 4, alignItems: "flex-start", width: "100%" })}>
          <FormsList forms={forms}  />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
