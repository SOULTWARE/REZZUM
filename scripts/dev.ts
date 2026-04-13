import { spawn, type ChildProcess } from "node:child_process";
import { loadScriptEnv } from "./load-env";

loadScriptEnv();

const shouldRunCronWorker = process.env.CRON_WORKER_ENABLED !== "false";
const nextDevArgs = process.argv.slice(2);
const children: ChildProcess[] = [];
let shuttingDown = false;

function resolveCommand(command: string) {
  if (process.platform === "win32" && command === "pnpm") {
    return "pnpm.cmd";
  }

  return command;
}

function startProcess(command: string, args: string[]) {
  const child = spawn(resolveCommand(command), args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  children.push(child);

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    for (const currentChild of children) {
      if (!currentChild.killed) {
        currentChild.kill("SIGTERM");
      }
    }

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }

  process.exit(0);
}

startProcess("pnpm", ["exec", "next", "dev", ...nextDevArgs]);

if (shouldRunCronWorker) {
  startProcess("node", ["--import", "tsx", "scripts/cron-worker.ts"]);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
