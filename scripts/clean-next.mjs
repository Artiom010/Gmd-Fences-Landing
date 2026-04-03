import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const paths = [join(root, ".next"), join(root, "node_modules", ".cache"), join(root, ".turbo")];

let removed = 0;
for (const p of paths) {
  if (existsSync(p)) {
    rmSync(p, { recursive: true, force: true });
    console.log("Removed", p.replace(root + "\\", "").replace(root + "/", ""));
    removed++;
  }
}

if (removed === 0) {
  console.log("Nothing to clean (.next, node_modules/.cache, .turbo were already absent)");
}
