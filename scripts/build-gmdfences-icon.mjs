import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const logoPath = join(root, "public", "img", "logo.svg");
const logo = readFileSync(logoPath, "utf8");
const match = logo.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
if (!match) throw new Error("Could not parse logo.svg");
const inner = match[1].replace(/fill="#020617"/g, 'fill="#F4C430"');
const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" role="img" aria-label="GMD Fences">
  <rect width="32" height="32" rx="6" fill="#0D1520"/>
  <g transform="translate(2.25,4.25) scale(0.492)">${inner}</g>
</svg>
`;
writeFileSync(join(root, "public", "gmdfences-icon.svg"), out);
writeFileSync(join(root, "public", "favicon.svg"), out);
console.log("Wrote public/gmdfences-icon.svg and public/favicon.svg");
