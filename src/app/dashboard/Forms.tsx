import { components } from "@/schema";
import { stack, hstack, center } from "@styled-system/patterns";
import Link from "next/link";
import formIcon from "@/assets/NotebookIcon.svg?url";
import warningIcon from "@/assets/Warning.svg?url";
import Image from "next/image";
import { css } from "@styled-system/css";
type Form = components["schemas"]["FormSummary"];

interface Props {
  formData: Form[];
}

export const Forms: React.FC<Props> = ({ formData }) => {
  return (
    <div
      className={stack({
        width: "4/5",
        flex: 1,
        gap: 6,
        md: {
          alignItems: "center",
        },
        maxWidth: "2xl",
      })}>
      {formData.map((data) => (
        <FormItem id={data.id} title={data.title} done={data.answer_id !== null} key={data.id} />
      ))}
    </div>
  );
};

interface FormItemProps {
  id: string;
  title: string;
  done?: boolean;
}

const FormItem = ({ id, title, done = false }: FormItemProps) => {
  return (
    <Link href={`/forms/${id}`} className={css({ display: "block", width: "100%", position: "relative" })}>
      {done || (
        <div
          className={css({
            position: "absolute",
            top: -3,
            left: 0,
          })}>
          <Image src={warningIcon} alt="" />
        </div>
      )}
      <div
        className={hstack({
          width: "full",
          gap: 4,
          borderWidth: 3,
          borderStyle: "solid",
          borderRadius: 9,
          paddingX: 4,
          paddingY: 4,

          cursor: "pointer",
          borderColor: "gray.400",
          transition: "all 0.2s",
          "&:hover": {
            background: "gray.200",
          },
        })}>
        <div className={center({ width: "58px", height: "58px", background: "tsukuba.purple", borderRadius: "full" })}>
          <Image
            src={formIcon}
            className={css({
              transform: "scale(0.75)",
            })}
            width={58 * 4}
            height={57 * 4}
            alt=""
          />
        </div>
        <span
          className={css({
            fontSize: "md",
            fontWeight: "bold",
          })}>
          {title}
        </span>
      </div>
    </Link>
  );
};
