import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:8080";
const dir = "/workspace/screenshots";
const browser = await chromium.launch({ args: ["--no-sandbox"] });

async function shot(page, name, path) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
}

const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const cons = [];
page.on("console", (m) => {
  if (m.type() === "error") cons.push(m.text());
});
page.on("pageerror", (e) => cons.push(String(e)));

await page.goto(base + "/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: /run mission/i }).click();
await page.waitForTimeout(2800);
await page.screenshot({ path: `${dir}/mission-running.png`, fullPage: false });

await page.goto(base + "/teammates", { waitUntil: "networkidle" });
await page.screenshot({ path: `${dir}/teammates.png`, fullPage: false });

await page.goto(base + "/spec", { waitUntil: "networkidle" });
await page.screenshot({ path: `${dir}/spec.png`, fullPage: false });

await page.goto(base + "/context", { waitUntil: "networkidle" });
await page.screenshot({ path: `${dir}/context.png`, fullPage: false });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/", { waitUntil: "networkidle" });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
await page.screenshot({ path: `${dir}/mobile.png` });

console.log(JSON.stringify({ cons, overflow }, null, 2));
await browser.close();
if (overflow) process.exit(2);
