import * as Sentry from "@sentry/nextjs";

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

  // enabled: process.env.NODE_ENV !== "development",

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
      isNameRequired: false,
      isEmailRequired: false,
      showBranding: false,
      buttonLabel: "問題の報告はこちら",
      formTitle: "問題の報告フォーム",
      emailLabel: "メールアドレス（任意）",
      emailPlaceholder: "メールアドレスを書いてください。",
      messageLabel: "問題の内容（必須）",
      messagePlaceholder: "問題の内容を書いてください。",
      submitButtonLabel: "問題を報告",
      cancelButtonLabel: "キャンセル",
    }),
  ],
});
