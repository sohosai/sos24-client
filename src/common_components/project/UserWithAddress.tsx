import { css } from "@styled-system/css";
import { hstack } from "@styled-system/patterns";
import MailAddressIcon from "@/assets/MailAddress.svg?url";
import React from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export const UserWithAddress: React.FC<{ name: string; email: string }> = ({ name, email }) => {
  return (
    <div
      className={hstack({ alignItems: "center", cursor: "pointer" })}
      onClick={() => {
        navigator.clipboard
          .writeText(email)
          .then(() => toast.success("メールアドレスをコピーしました"))
          .catch(() => toast.error("コピーに失敗しました"));
      }}>
      <Image src={MailAddressIcon} alt="" className={css({ height: "full" })} />
      {name}
    </div>
  );
};
