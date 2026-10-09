// `npm run dev`: builds the photos, keeps rebuilding them while you add or
// replace files in assets-src/photos/, and runs the Next.js dev server.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

import { generate, watch } from "./images.mjs";

await generate();
watch();

const next = createRequire(import.meta.url).resolve("next/dist/bin/next");
const child = spawn(process.execPath, [next, "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
});
child.on("exit", (code) => process.exit(code ?? 0));
