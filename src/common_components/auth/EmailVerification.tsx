import { center } from "@styled-system/patterns";
import { css, cx } from "@styled-system/css";
import SendButton from "@/assets/SendButton_white.svg?url";
import Image from "next/image";
import { sendEmailVerification } from "firebase/auth";
import { useAuthState } from "@/lib/firebase";
import { useState } from "react";
import toast from "react-hot-toast";
import { buttonStyle } from "@/recipes/button";

interface EmailVerificationProps {
  userEmail: string | null;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ userEmail }) => {
  const authState = useAuthState();
  const [isSent, setIsSent] = useState(false);
  const handleResend = () => {
    toast.promise(
      sendEmailVerification(authState.user!).then(() => {
        setIsSent(true);
      }),
      {
        loading: "メールを送信中...",
        success: "メールを送信しました",
        error: "メールの送信に失敗しました",
      },
    );
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
          <p>登録されたメールアドレスに確認メールをお送りしています</p>
          <p>メールに記載されたリンクをクリックして登録を完了してください</p>
          <p>
            受信できない場合、system@sohosai.comからのメールが迷惑メールフォルダに配信されていないかご確認してください
          </p>
        </section>
        <p className={css({ color: "gray.700" })}>再送しても届かない場合は時間を空けてからお試しください</p>
        <div className={css({ display: "flex", flexDir: "column", gap: 2 })}>
          <button
            className={cx(
              buttonStyle({ visual: "solid", color: "purple" }),
              css({
                alignSelf: "center",
                display: "flex!",
                alignItems: "flex-end",
                gap: 2,
                _disabled: {
                  opacity: 0.5,
                  cursor: "default",
                  "&:hover": { opacity: 0.5 },
                },
              }),
            )}
            onClick={handleResend}
            disabled={isSent}>
            <span>確認メールを再送する</span>
            <Image src={SendButton} alt="" width={20} height={20} />
          </button>
          {userEmail && (
            <a
              href={`https://outlook.office.com/mail/${userEmail}/inbox/`}
              target="_blank"
              rel="noreferrer noopener"
              className={cx(
                buttonStyle({ visual: "outline", color: "purple" }),
                css({
                  alignSelf: "center",
                  display: "flex!",
                  alignItems: "flex-end",
                  gap: 2,
                  _disabled: {
                    opacity: 0.5,
                    cursor: "default",
                    "&:hover": { opacity: 0.5 },
                  },
                }),
              )}>
              Outlook を開く（外部）
            </a>
          )}
          {isSent && (
            <p className={css({ color: "gray.700", fontSize: "sm" })}>
              確認メールを再送しました
              <br /> 受け取れない場合はproject51th@sohosai.comまでご連絡ください。
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
