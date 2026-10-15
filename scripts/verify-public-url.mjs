const rawUrl = process.argv[2];

if (!rawUrl) {
  console.error("Usage: node scripts/verify-public-url.mjs https://your-smartplate.example");
  process.exitCode = 1;
} else {
  const origin = new URL(rawUrl);
  if (origin.protocol !== "https:") {
    console.error("A deployed SMARTPLATE URL must use HTTPS.");
    process.exitCode = 1;
  } else {
    const checks = [
      ["health", "/api/health", (body) => body.service === "smartplate" && body.status === "ok"],
      ["robots", "/robots.txt", (body) => body.includes("Disallow: /admin")],
      ["sitemap", "/sitemap.xml", (body) => body.includes("/restaurants")],
    ];
    let failed = false;
    for (const [name, path, validate] of checks) {
      const response = await fetch(new URL(path, origin));
      const body =
        name === "health" ? await response.json().catch(() => null) : await response.text();
      const passed = response.ok && validate(body);
      console.log(`${passed ? "PASS" : "FAIL"} ${name}: ${response.status}`);
      failed ||= !passed;
    }
    process.exitCode = failed ? 1 : 0;
  }
}
