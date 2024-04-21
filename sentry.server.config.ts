import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://46644e4ad167a3a09182716f44bc953d@o4507113970466816.ingest.us.sentry.io/4507114421747712",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
