import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e094d741d3af07af62a4b195cf26d26f@o4507094285418496.ingest.us.sentry.io/4507112915992576",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
