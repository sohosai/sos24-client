import { css } from "@styled-system/css";
import { hstack } from "@styled-system/patterns";
import MailAddressIcon from "@/assets/MailAddress.svg?url";
import React from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export const UserWithAddress: React.FC<{ name: string; email: string }> = ({ name, email }) => {
  return (
    <button
      className={`${hstack({ alignItems: "center", cursor: "pointer" })} block-me`}
      onClick={() => {
        toast.promise(
          navigator.clipboard.writeText(email).catch(() => {
            throw new Error("メールアドレスのコピーに失敗しました");
          }),
          {
            loading: "メールアドレスをコピー中...",
            success: "メールアドレスをコピーしました",
            error: "メールアドレスのコピーに失敗しました",
          },
        );
      }}>
      <Image src={MailAddressIcon} alt="" className={css({ height: "full" })} />
      {name}
    </button>
  );
};
