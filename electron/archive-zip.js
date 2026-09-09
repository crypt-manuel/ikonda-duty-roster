"use strict";
/* electron-builder's zip target stores the app files at the archive root, so
   unzipping scatters ~40 loose files into whatever folder the user picked.
   This repacks it with a top-level folder (matching the tar.gz layout), so the
   download extracts as one tidy directory containing "Duty Roster.exe".
   Runs automatically as postdist. */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const version = require("./package.json").version;
const dist = path.join(__dirname, "dist");
const folder = `DutyRoster-${version}-win-x64`;
const unpacked = path.join(dist, "win-unpacked");
const staged = path.join(dist, folder);
const zip = path.join(dist, folder + ".zip");

if (!fs.existsSync(unpacked)) {
  console.error("dist/win-unpacked not found — run the build first.");
  process.exit(1);
}
// Use Windows' own bsdtar by full path: it writes zip (GNU tar cannot), and a bare
// "tar" would resolve to Git Bash's GNU tar when run from a POSIX shell — which also
// mistakes an absolute "E:\..." output path for a remote host.
const bsdtar = path.join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe");
if (!fs.existsSync(bsdtar)) {
  console.error("bsdtar not found at " + bsdtar + " — leaving the builder's zip as it is.");
  process.exit(1);
}
if (fs.existsSync(staged)) fs.rmSync(staged, { recursive: true, force: true });
fs.renameSync(unpacked, staged);
try {
  fs.rmSync(zip, { force: true });
  // relative paths, with dist as cwd, so no drive letter reaches the archiver
  execFileSync(bsdtar, ["-a", "-c", "-f", folder + ".zip", folder], { cwd: dist, stdio: "inherit" });
  console.log("Repacked " + folder + ".zip with a top-level folder");
} finally {
  fs.renameSync(staged, unpacked); // leave win-unpacked where the builder expects it
}
