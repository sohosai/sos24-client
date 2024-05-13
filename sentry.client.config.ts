import * as Sentry from "@sentry/nextjs";
import { token } from "@styled-system/tokens";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Replay may only be enabled for the client-side
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
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
      messagePlaceholder:
        "企画に関するお問い合わせは、project50th@sohosai.comまでお送りください。（返信は致しません。）",
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
