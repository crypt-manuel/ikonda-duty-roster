"use strict";
/* Refreshes the private real-names copy from the maintained public file.
 *
 *   node sync-local.js
 *
 * duty-roster.html is the single source of truth; local/duty-roster-ikonda.html is
 * the same app with the real staff list. This copies the former over the latter and
 * puts the real names back, so the two can't silently drift apart after a fix.
 *
 * The names never appear in this script (it is committed). They come from
 * local/staff.json if that exists, otherwise they are read back out of the existing
 * local copy before it is overwritten. Both live in the gitignored local/ folder.
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const src = path.join(root, "duty-roster.html");
const localDir = path.join(root, "local");
const dst = path.join(localDir, "duty-roster-ikonda.html");
const namesFile = path.join(localDir, "staff.json");

const BLOCK = /const DEFAULT_STAFF = \[[\s\S]*?\];/;
const isPlaceholder = names => names.every(n => /^Doctor \d+$/.test(n));

function namesFrom(text) {
  const m = text.match(BLOCK);
  if (!m) return null;
  const arr = m[0].slice(m[0].indexOf("["), m[0].lastIndexOf("]") + 1);
  try { return JSON.parse(arr); } catch (e) { return null; } // plain JSON array literal
}
function blockFor(names) {
  const lines = [];
  for (let i = 0; i < names.length; i += 4)
    lines.push(names.slice(i, i + 4).map(n => JSON.stringify(n)).join(","));
  return "const DEFAULT_STAFF = [" + lines.join(",\n  ") + "];";
}
function die(msg) { console.error("sync-local: " + msg); process.exit(1); }

if (!fs.existsSync(src)) die("cannot find " + src);
const source = fs.readFileSync(src, "utf8");
if (!BLOCK.test(source)) die("no DEFAULT_STAFF block in duty-roster.html — has it been renamed?");

// Where do the real names come from?
let names = null, origin = "";
if (fs.existsSync(namesFile)) {
  try { names = JSON.parse(fs.readFileSync(namesFile, "utf8")); }
  catch (e) { die("local/staff.json is not valid JSON: " + e.message); }
  if (!Array.isArray(names) || !names.length || !names.every(n => typeof n === "string"))
    die("local/staff.json must be a non-empty array of name strings");
  origin = "local/staff.json";
} else if (fs.existsSync(dst)) {
  names = namesFrom(fs.readFileSync(dst, "utf8"));
  if (!names) die("could not read the staff list out of the existing local copy;\n" +
                  "  create local/staff.json with [\"Name One\", \"Name Two\", ...] instead");
  origin = "the existing local copy";
} else {
  die("no local copy and no local/staff.json to take the real names from.\n" +
      "  Create local/staff.json containing [\"Name One\", \"Name Two\", ...] and run this again.");
}

// Never overwrite a real-names copy with the placeholders
if (isPlaceholder(names))
  die("the names found in " + origin + " are the \"Doctor N\" placeholders, not the real list —\n" +
      "  refusing to write, so a real staff list can't be lost. Restore it or create local/staff.json.");

fs.mkdirSync(localDir, { recursive: true });
fs.writeFileSync(dst, source.replace(BLOCK, () => blockFor(names)));

// Confirm the result differs from the public file in the staff list only
const check = fs.readFileSync(dst, "utf8");
const differs = check.replace(BLOCK, "") !== source.replace(BLOCK, "");
console.log("Synced duty-roster.html -> local/duty-roster-ikonda.html");
console.log("  staff list (" + names.length + " names) taken from " + origin);
console.log(differs
  ? "  WARNING: the copies differ outside the staff list — check it by hand"
  : "  the two files now differ in the staff list only");
