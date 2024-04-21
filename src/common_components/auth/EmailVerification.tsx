import { center } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { Button } from "@/common_components/Button";
import SendButton from "@/assets/SendButton.svg?url";
import Image from "next/image";
import { sendEmailVerification } from "firebase/auth";
import { useAuthState } from "@/lib/firebase";
import { useState } from "react";
import toast from "react-hot-toast";

export const EmailVerification = () => {
  const authState = useAuthState();
  const [isSent, setIsSent] = useState(false);
  const handleResend = () => {
    sendEmailVerification(authState.user!).then(() => {
      setIsSent(true);
      toast.success("確認メールを再送しました");
    });
  };
  return (
    <div
      className={center({
        flexDir: "column",
        minHeight: "calc(100vh - token(spacing.20))",
      })}>
      <div
        className={css({
          boxShadow: "token(shadows.md)",
          paddingY: 11,
          paddingX: 20,
          borderRadius: "token(xl)",
          width: "fit-content",
          maxWidth: "2xl",
          textAlign: "center",
          display: "flex",
          flexDir: "column",
          gap: 8,
        })}>
        <h1
          className={css({
            fontSize: "2xl",
            fontWeight: "bold",
          })}>
          メールアドレスの確認をお願いします
        </h1>
        <section className={css({ color: "gray.700", textAlign: "justify" })}>
          <p>{authState.user?.email}に確認メールをお送りしています</p>
          <p>メールに記載されたリンクをクリックして登録を完了してください</p>
          <p>
            受信できない場合、system@sohosai.comからのメールが迷惑メールフォルダに配信されていないかご確認してください
          </p>
        </section>
        <p className={css({ color: "gray.700" })}>再送しても届かない場合は時間を空けてからお試しください</p>
        <div className={css({ display: "flex", flexDir: "column", gap: 2 })}>
          <Button
            color={"secondary"}
            className={css({
              alignSelf: "center",
              display: "flex",
              alignItems: "flex-end",
              gap: 2,
              _disabled: {
                opacity: 0.5,
                cursor: "default",
                "&:hover": { opacity: 0.5 },
              },
            })}
            onClick={handleResend}
            disabled={isSent}>
            <span>確認メールを再送する</span>
            <Image src={SendButton} alt="" width={20} height={20} />
          </Button>
          {isSent && (
            <p className={css({ color: "gray.700", fontSize: "sm" })}>
              確認メールを再送しました
              <br /> 受け取れない場合はproject50th@sohosai.comまでご連絡ください。
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
