import { grid } from "@styled-system/patterns";
import { css, cx } from "@styled-system/css";
import React, { ReactNode } from "react";

const tableCellStyle = css({
  base: {
    fontSize: "sm",
    paddingInlineStart: 2,
    paddingInlineEnd: 0,
    paddingY: 4,
  },
  sm: {
    paddingX: 14,
    paddingY: 4,
    alignSelf: "center",
  },
});

export const TableRow = ({ label, children, formId }: { label: ReactNode; children: ReactNode; formId?: string }) => (
  <div
    className={grid({
      columns: 2,
      _even: {
        backgroundColor: "gray.100",
      },
      borderRadius: "md",
    })}>
    <label htmlFor={formId} className={cx(tableCellStyle, css({ fontWeight: "bold" }))}>
      {label}
    </label>
    <div className={tableCellStyle}>{children}</div>
  </div>
);
