import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const source = join(
  root,
  "node_modules/piper-tts-web/dist/piper-tts-web.js"
);
const destination = join(root, "public/vendor/piper-tts-web.js");

const [from, to] = await Promise.all([
  stat(source),
  stat(destination).catch(() => null),
]);

if (to && to.size === from.size && to.mtimeMs >= from.mtimeMs) {
  console.log(
    `piper-tts-web.js up to date (${(from.size / 1e6).toFixed(1)} MB)`
  );
} else {
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
  console.log(
    `copied piper-tts-web.js -> public/vendor/ (${(from.size / 1e6).toFixed(1)} MB)`
  );
}
