// Central place where configuration is read. Secrets come only from the
// environment: a local .env file in development, real env vars (Kubernetes
// Secret / CI secrets) in production. Never add fallback values for secrets.
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const REQUIRED = ["MONGODB_URI", "TOKEN_SECRET"];

const missing = REQUIRED.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(
    `Missing required environment variable(s): ${missing.join(", ")}. ` +
      "Copy .env.example to .env for local development, or set them in your deployment."
  );
  process.exit(1);
}

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  EXPIRATION_TIME: process.env.EXPIRATION_TIME || "1h",
  PORT: process.env.PORT || 4000,
};
