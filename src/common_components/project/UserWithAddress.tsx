import { css } from "@styled-system/css";
import { hstack } from "@styled-system/patterns";
import MailAddressIcon from "@/assets/MailAddress.svg?url";
import React from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export const UserWithAddress: React.FC<{ name: string; email: string }> = ({ name, email }) => {
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
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
  };

  const handleCopyName = () => {
    toast.promise(
      navigator.clipboard.writeText(name).catch(() => {
        throw new Error("名前のコピーに失敗しました");
      }),
      {
        loading: "名前をコピー中...",
        success: "名前をコピーしました",
        error: "名前のコピーに失敗しました",
      },
    );
  };

  return (
    <div className={hstack({ alignItems: "center", gap: 2 })}>
      <button
        className={css({ cursor: "pointer", display: "flex", alignItems: "center" })}
        onClick={handleCopyEmail}
        title="メールアドレスをコピー">
        <Image src={MailAddressIcon} alt="メールアドレスをコピー" className={css({ height: "full" })} />
      </button>
      <button
        className={css({ cursor: "pointer", textDecoration: "underline" })}
        onClick={handleCopyName}
        title="名前をコピー">
        {name}
      </button>
    </div>
  );
};
