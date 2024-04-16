import { css } from "@styled-system/css";

export const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  return (
    <span
      className={css({
        display: "inline-grid",
        placeContent: "center",
        background: "red.500",
        color: "white",
        fontSize: "xs",
        width: 5,
        height: 5,
        rounded: "full",
        aspectRatio: "1/1",
      })}>
      {count}
    </span>
  );
};
