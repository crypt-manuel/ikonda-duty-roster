"use strict";
/* Copies the maintained single-file app into the Electron package.
   The HTML file stays the single source of truth — this wrapper never forks it.
     node sync.js           -> bundles ../duty-roster.html (placeholder names, committed)
     node sync.js --local   -> bundles ../local/duty-roster-ikonda.html (real names, private builds) */
const fs = require("fs");
const path = require("path");

const useLocal = process.argv.includes("--local");
const src = useLocal
  ? path.join(__dirname, "..", "local", "duty-roster-ikonda.html")
  : path.join(__dirname, "..", "duty-roster.html");

if (!fs.existsSync(src)) {
  console.error("Source file not found: " + src);
  process.exit(1);
}
const dstDir = path.join(__dirname, "app");
fs.mkdirSync(dstDir, { recursive: true });
fs.copyFileSync(src, path.join(dstDir, "duty-roster.html"));
console.log("Synced " + path.basename(src) + " -> electron/app/duty-roster.html" + (useLocal ? " (LOCAL real-names build)" : ""));
