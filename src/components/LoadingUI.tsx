import React from "react";
import { Loading } from "@/components/Loading";
import { css } from "@styled-system/css";
import { NextPage } from "next";

export const LoadingUI: NextPage = () => {
  return (
    <div
      className={css({
        height: "calc(100vh - token(spacing.20))",
      })}>
      <Loading />
    </div>
  );
};
