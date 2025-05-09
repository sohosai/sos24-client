import * as Sentry from "@sentry/nextjs";
import { token } from "@styled-system/tokens";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.feedbackIntegration({
      colorScheme: "light",
      showName: false,
      showEmail: false,
      isNameRequired: false,
      isEmailRequired: false,
      showBranding: false,
      buttonLabel: "不具合の報告はこちら",
      formTitle: "不具合の報告フォーム",
      messageLabel: "不具合の内容",
      messagePlaceholder: "返信が必要なお問い合わせは、project51th@sohosai.com までお送りください。",
      submitButtonLabel: "不具合を報告",
      cancelButtonLabel: "キャンセル",
      themeLight: {
        submitBorder: token("colors.tsukuba.purple"),
        submitOutlineFocus: "rgba(102, 0, 204, 0.75)",
        submitBackground: token("colors.tsukuba.purple"),
        submitBackgroundHover: "rgba(102, 0, 204, 0.75)",
      },
    }),
  ],
});
