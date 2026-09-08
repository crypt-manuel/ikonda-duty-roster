# Duty Roster App — Progress Note

_Last updated: 2026-09-08_

## What this project is
An **offline, single-file duty roster app** for Consolata Hospital Ikonda (OPD & EMD),
replacing the hand-filled Word/paper roster. Everything lives in **`duty-roster.html`**
(~360 KB — the hospital logo and the html2canvas library are embedded, so the one file
can be copied to any PC/flash drive and opened in Chrome/Edge with no internet).

## Repository layout (since GitHub publication, Sep 2026)
- `duty-roster.html` — the app, committed with **placeholder staff names** ("Doctor 1"–"Doctor 14")
- `local/` — **gitignored**, private material:
  - `duty-roster-ikonda.html` — the copy with the real Ikonda staff list in `DEFAULT_STAFF`
  - `Duty Roster.docx` — original rough Word template (14 doctors, days 1–31, key M/E/N/M-E/O)
  - `PXL_20260530_045514613.jpg` — photo of the hand-filled June 2026 paper roster
  - `Screenshot 2026-09-07 133430.png` — clean hospital logo (already embedded in the app, 280px)
- `docs/screenshot.png` — README screenshot (June 2026 demo, placeholder names)
- `README.md`, `LICENSE` (MIT)

## Features built and tested
- **Shift painting**: palette of M / D / E / N / M/E / ENT / ECH(O) / O / L — click or drag
  (drag interpolation fills skipped cells); right-click erases a cell; toggle by re-clicking.
- **Manual highlighter** (🖍 pink overlay): admin marks priority cells — deliberately NOT
  automatic on mornings (user was explicit about this).
- **Balance assistant (⚖)** — assists, never replaces:
  - fairness table (counts vs team average, red/green deviations), Unit column for ENT+ECHO days
  - rest-rule warnings: >6 consecutive workdays, night→morning/day/clinic turnaround
  - per-day M/E/N coverage rows — **screen only, excluded from print/PDF/PNG by user request**
    ("Print coverage" checkbox, off by default, can re-include them)
  - ✨ Suggest fills: greedy run-of-4 rotation engine, staggered rest phases per staff index,
    plus a repair pass that fixes zero-coverage days (preferring the person with fewest of that
    shift). Suggestions render as grey italic "ghosts"; Accept all / Discard / paint-over.
  - **⟳ fixed-pattern staff** (staff panel toggle or Pattern dialog checkbox): balance assistant
    ignores them completely (no suggestions, no warnings, excluded from averages) but their
    shifts still count toward daily coverage.
- **ENT & ECHO clinic rotations**: paintable codes (peach/tan), count as work for rest rules,
  do NOT count as OPD coverage; suggester never proposes them and rests people after clinic runs.
- **Cadre / level**: per-staff SP / MD / INT / CO dropdown in Staff panel → small badge after
  the name on the sheet and in CSV.
- **Leave planner (🏖)**: person + day range → fills L cells + auto-appends a NOTES line.
- **Pattern fill (▦)**: repeating pattern string (e.g. MMMMOEEEEO) per person; skips L days.
- **Swap tool (⇄ in palette)**: click two cells to swap shifts+highlights.
- **Tanzania public holidays**: fixed dates + Good Friday/Easter Monday (computus); click a
  day-number header to toggle a custom holiday (e.g. Eid). Rose shading + legend entry.
- **Exports**: Print/PDF (A4 landscape, one page, colour or B&W ink-saver mode), PNG image
  (html2canvas, for WhatsApp), CSV (Excel; cells starting with =/+/-/@ get an apostrophe
  prefix against formula injection), JSON backup/restore. Backup button uses the
  **File System Access API** when available (Chrome/Edge): saves straight to a chosen
  file, handle remembered in IndexedDB db `dutyRosterFS` (re-save without re-picking;
  right-click = pick new file; write failure → re-pick → download fallback; browsers
  without the API get the plain download).
- **📱 Share (per person)**: dialog with staff picker (or "All staff" for the group chat) →
  editable WhatsApp text preview (runs grouped "Mo 1 – Th 4: Morning", totals line, *bold*
  markers) with Copy button (clipboard API + execCommand fallback), and an **.ics calendar
  download** (floating local times, per-day timed events with 1-h VALARM, night shifts roll
  past midnight/month end, leave runs = single all-day events, O excluded; times in
  `SHIFT_TIMES` const, all user-confirmed — M 08:00–14:00, D 08:00–20:00, E 14:00–22:00,
  N 22:00–07:30, M/E 10:00–17:00 (a mid-day bridge shift, not morning+evening combined),
  ENT/ECHO 08:00–14:00 (same frame as morning; clinics sit in subdepartments run by
  EMD/IMED, hence "out of schedule" for OPD coverage — matches the existing rule that
  they don't count toward coverage)).
- **Persistence**: localStorage autosave per month; new month copies the staff list forward.
- Editable header (hospital, department line, motto), NOTES box, signature lines,
  Sunday shading, today marker (screen only), per-row totals (toggleable).
- **Footer swap**: signature lines (`.signs`) show only in print/PDF and PNG export;
  on screen they're replaced by `#copyfoot` — "© <year> <hospital> · Duty Roster App
  v<APP_VERSION>" (constant next to STORE, currently "1.0" — bump on future releases).
- **Aesthetic pass (Sep 2026)**: stronger Sunday tint (`--sun:#e6e7ef`) + red Sunday/holiday
  day-numbers in the header (higher-specificity rule needed vs `thead tr:first-child th`);
  2px week-boundary line before Monday columns (`mon` class from `dayCls`, also on tfoot);
  legend split into KEY row (shifts) + MARKS row (highlight/Sunday/holiday chips).

## Technical notes for the next session
- Vanilla JS, no build step. Storage key `dutyRosterApp.v1`; state shape:
  `{hospital, dept, motto, current:"YYYY-MM", nextId, rosters:{ "YYYY-MM": {staff:[{id,name,role,fixed}], cells:{"id_day":code}, hl:{}, sugg:{}, customHol:[], notes} }}`.
- **Editing the file**: use targeted edits — a full rewrite loses the embedded logo data-URI and
  the inlined html2canvas `<script>`. If a rewrite is unavoidable, re-embed: logo via
  System.Drawing downscale→base64 replace of `src="logo.png"`, html2canvas 1.4.1 from cdnjs
  replacing `<script src="html2canvas.min.js"></script>`.
- **Testing**: browser pane loads the file as a data: snapshot — localStorage throws there
  (wrapped in try/catch, harmless) and synthetic drags can be flaky; drive logic via
  `javascript_tool` (globals: `state`, `roster()`, `analyse()`, `makeSuggestions()`, `renderAll()`).
- **PDF check**: headless Chrome — copy file to scratchpad, append a `<script>` seed block,
  `chrome --headless=new --no-pdf-header-footer --print-to-pdf=...`. Edge headless failed; use
  `C:\Program Files\Google\Chrome\Application\chrome.exe`.
- Zebra striping uses a zero-specificity `:where()` so shift colours win; `[hidden]{display:none!important}`
  was needed because `.lg{display:flex}` overrode the hidden attribute.

## Ideas discussed but NOT yet built
- Cadre-aware rules (e.g. warn if no MD+ on a night; interns never solo on nights)
- Multiple departments/sheets in one file (feature 8 — user chose 1–7 only)
- Tuning the suggestion engine to the department's real rotation rhythm
  (currently run-of-4, M→E→N→D order — ask the user for their actual pattern)

## Current status
All requested features delivered and verified (logic tests via browser JS + headless PDF prints).
Latest sample PDF: scratchpad `duty-roster-sample-v5.pdf` (June 2026 demo: cadres, ENT/ECHO runs,
leave, highlights, no coverage rows in print). No known bugs.
