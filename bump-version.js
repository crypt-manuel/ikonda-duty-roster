"use strict";
/* Sets the version everywhere it appears, in one step.
 *
 *   node bump-version.js 1.2.0            update the files
 *   node bump-version.js 1.2.0 --dry-run  show what would change
 *
 * The number lives in two places that must agree:
 *   duty-roster.html      const APP_VERSION = "1.2"   (shown in the on-screen footer)
 *   electron/package.json "version": "1.2.0"          (names the built exes/archives)
 *
 * APP_VERSION drops a trailing ".0", matching the existing style: 1.2.0 -> "1.2",
 * while a patch release keeps all three parts: 1.2.1 -> "1.2.1".
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const htmlFile = path.join(root, "duty-roster.html");
const pkgFile = path.join(root, "electron", "package.json");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const version = args.find(a => !a.startsWith("--"));

const die = m => { console.error("bump-version: " + m); process.exit(1); };

if (!version) die("give the new version, e.g. node bump-version.js 1.2.0");
if (!/^\d+\.\d+\.\d+$/.test(version)) die('version must look like 1.2.0 (got "' + version + '")');
const display = version.replace(/\.0$/, ""); // 1.2.0 -> 1.2 ; 1.2.1 stays

const APPV = /(const APP_VERSION = ")([^"]*)(")/;
const PKGV = /("version":\s*")([^"]*)(")/;

const html = fs.readFileSync(htmlFile, "utf8");
const pkg = fs.readFileSync(pkgFile, "utf8");
const curHtml = (html.match(APPV) || [])[2];
const curPkg = (pkg.match(PKGV) || [])[2];
if (curHtml === undefined) die("no APP_VERSION found in duty-roster.html");
if (curPkg === undefined) die("no version field found in electron/package.json");

// Flag a pre-existing mismatch rather than quietly papering over it
if (curPkg.replace(/\.0$/, "") !== curHtml)
  console.warn('bump-version: note - the two files disagree right now ("' + curHtml +
               '" vs "' + curPkg + '"); both will be set to the new version.');

console.log("duty-roster.html       APP_VERSION  " + curHtml + "  ->  " + display);
console.log("electron/package.json  version      " + curPkg + "  ->  " + version);

if (dryRun) { console.log("\n(dry run - nothing written)"); process.exit(0); }
if (version === curPkg && display === curHtml) die("already at " + version + " - nothing to do");

fs.writeFileSync(htmlFile, html.replace(APPV, (m, a, _old, c) => a + display + c));
fs.writeFileSync(pkgFile, pkg.replace(PKGV, (m, a, _old, c) => a + version + c));

// keep the private real-names copy in step with the file we just edited
try {
  execFileSync(process.execPath, [path.join(root, "sync-local.js")], { stdio: "inherit" });
} catch (e) {
  console.warn("bump-version: sync-local.js did not run cleanly - sync the local copy by hand");
}

console.log("\nNext:");
console.log("  1. add the release notes to CHANGELOG.md");
console.log("  2. cd electron && npm run dist        (rebuild the desktop artifacts)");
console.log("  3. commit, then tag v" + display + " and create the release");
