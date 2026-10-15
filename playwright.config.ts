import { defineConfig } from "@playwright/test";
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
    reuseExistingServer: true,
    timeout: 120000,
  },
});
