// Copies POST.json (the X post address for this make.fun entry) from the
// repository to the output directory. That is all it has to do: the house
// reads the post itself through FxTwitter.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
const postPath = join(repoDir, "POST.json");
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// The post address must be an X status URL: https://x.com/<handle>/status/<digits>
const STATUS_URL = /^https:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/[^/]+\/status\/\d+$/;

const raw = readFileSync(postPath, "utf8");
const post = JSON.parse(raw);
if (typeof post !== "object" || post === null || typeof post.url !== "string") {
  console.error("POST.json must be a JSON object with a string \"url\" field");
  process.exit(1);
}
if (!STATUS_URL.test(post.url.split(/[?#]/)[0])) {
  console.error(`bad post url: ${post.url}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(postPath, join(outDir, "POST.json"));
