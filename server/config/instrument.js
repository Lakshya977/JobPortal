// Import with `"` if you are using ESM
import * as Sentry from "@sentry/node"
Sentry.init({
  dsn: "https://e87d4dcde2ca521e462cbc16bcab5c41@o4509280919617536.ingest.us.sentry.io/4509281045250048",
  integrations: [Sentry.mongooseIntegration()],
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  
  // tracesSampleRate: 1.0,
});