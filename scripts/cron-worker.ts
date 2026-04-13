import { loadScriptEnv } from "./load-env";

const DEFAULT_INTERVAL_MS = 60_000;
const DEFAULT_STARTUP_DELAY_MS = 5_000;

loadScriptEnv();

function parseMilliseconds(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

function isEnabled(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }

  return value !== "false";
}

const intervalMs = parseMilliseconds(process.env.CRON_WORKER_INTERVAL_MS, DEFAULT_INTERVAL_MS);
const startupDelayMs = parseMilliseconds(
  process.env.CRON_WORKER_STARTUP_DELAY_MS,
  DEFAULT_STARTUP_DELAY_MS,
);
const runOnStartup = isEnabled(process.env.CRON_WORKER_RUN_ON_STARTUP, true);
const runOnce = process.env.CRON_WORKER_RUN_ONCE === "true";

let isTickRunning = false;

async function tick(reason: "startup" | "interval" | "once") {
  if (isTickRunning) {
    console.log(`[cron-worker] skipping ${reason} tick because a previous run is still active.`);
    return;
  }

  isTickRunning = true;

  try {
    const [{ publishDuePosts }, { syncDueFeeds }] = await Promise.all([
      import("../server/publishing/service"),
      import("../server/pipeline/service"),
    ]);
    const [feedResults, publishResults] = await Promise.all([syncDueFeeds(), publishDuePosts()]);

    console.log(
      `[cron-worker] ${reason} tick complete ${JSON.stringify({
        processedAt: new Date().toISOString(),
        feedResults,
        publishResults,
      })}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown cron worker failure.";
    console.error(`[cron-worker] ${reason} tick failed: ${message}`);
  } finally {
    isTickRunning = false;
  }
}

if (runOnce) {
  void tick("once").finally(() => {
    process.exit(0);
  });
} else {
  console.log(
    `[cron-worker] polling every ${Math.round(intervalMs / 1000)}s with a ${Math.round(
      startupDelayMs / 1000,
    )}s startup delay.`,
  );

  if (runOnStartup) {
    setTimeout(() => {
      void tick("startup");
    }, startupDelayMs);
  }

  const intervalTimer = setInterval(() => {
    void tick("interval");
  }, intervalMs);

  function shutdown(signal: NodeJS.Signals) {
    clearInterval(intervalTimer);
    console.log(`[cron-worker] received ${signal}, shutting down.`);
    process.exit(0);
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}
