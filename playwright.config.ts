import { defineConfig } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

function localChromiumExecutable(): string | undefined {
  const browsersPath = process.env.LOCALAPPDATA
    ? join(process.env.LOCALAPPDATA, "ms-playwright")
    : undefined;

  if (!browsersPath || !existsSync(browsersPath)) return undefined;

  const browserDirectories = readdirSync(browsersPath)
    .filter((directory) => /^chromium-\d+$/.test(directory))
    .sort((a, b) => Number(b.slice(9)) - Number(a.slice(9)));

  for (const directory of browserDirectories) {
    for (const folder of ["chrome-win64", "chrome-win"]) {
      const executable = join(browsersPath, directory, folder, "chrome.exe");
      if (existsSync(executable)) return executable;
    }
  }

  return undefined;
}

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? localChromiumExecutable();
const e2eAuthSecret = process.env.AUTH_SECRET ?? randomBytes(32).toString("hex");

export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3000",
    launchOptions: executablePath ? { executablePath } : undefined,
  },
  projects: [
    { name: "mobile-375", use: { viewport: { width: 375, height: 812 } } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1440", use: { viewport: { width: 1440, height: 1000 } } },
  ],
  webServer: {
    command: "npm run build && npm run start -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    // E2E must own its server. Reusing a stopping dev/test process can make all workers race
    // against a closed port and accidentally exercise an unrelated build.
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      ...process.env,
      AUTH_SECRET: e2eAuthSecret,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? e2eAuthSecret,
      NEXTAUTH_URL: "http://127.0.0.1:3000",
    },
  },
});
