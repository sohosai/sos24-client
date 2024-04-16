import { css } from "@styled-system/css";
import React from "react";

// ref: https://stackoverflow.com/questions/69530735/make-a-css-rounded-dotted-line

export const Separator = () => {
  return (
    <div
      className={css({
        height: 1,
        width: "full",
        background:
          "radial-gradient(circle closest-side, var(--colors-gray-400) 98%,#0000)   50%/10px 100%," +
          "linear-gradient(90deg, var(--colors-gray-400) 50%, #0000 0)              50%/20px 100%;",
      })}></div>
  );
};
