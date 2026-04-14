const ENV_FILES_BY_PRECEDENCE = [
  ".env",
  ".env.local",
  `.env.${process.env.NODE_ENV ?? "development"}`,
  `.env.${process.env.NODE_ENV ?? "development"}.local`,
];

export function loadScriptEnv() {
  for (const envFile of ENV_FILES_BY_PRECEDENCE) {
    try {
      process.loadEnvFile?.(envFile);
    } catch {
      // Ignore missing files. Production can provide env vars directly.
    }
  }
}
