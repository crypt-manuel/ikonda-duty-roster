# Changelog

All notable changes to the Duty Roster app. Versions follow the GitHub releases at
<https://github.com/crypt-manuel/ikonda-duty-roster/releases>.

## [Unreleased]

_Nothing yet — add entries here as work lands, then move them under a version heading
when it is released._

## [1.1] — 2026-09-09

### Added

- **⧉ Copy last month** — clones the previous month's staff list, cadres and
  fixed-pattern flags, and the whole shift grid, into the current month. The copy is
  **aligned by weekday** (each day takes the shift from the same weekday four weeks
  earlier), so Sunday rest days stay on Sundays across 28/29/30/31-day months. Leave
  days are deliberately left behind, since leave belongs to its own month.
- **Keyboard entry** — click a cell to place a cursor, then arrow keys move it and
  letter keys paint: `M` `D` `E` `N` `O` `L`, `X` = M/E, `T` = ENT, `C` = ECHO. The
  cursor steps right after each letter, so a week of mornings is just `MMMMM`.
  `H` toggles the highlighter, `Delete` clears, `Backspace` clears and steps back,
  `Home`/`End` jump to the month edges, `Escape` hides the cursor.
- **Backup safety** — downloaded backups are named with a date and time
  (`duty-roster-backup-2026-09_2026-09-09_14-32.json`) so successive files on a flash
  drive can't be confused, and the toolbar shows a **"Last backup"** indicator.
- **Desktop (Electron) edition** — the same app as a Windows program, available as a
  zip/tar.gz archive, a portable single exe for flash drives, or an installer. It
  wraps the identical `duty-roster.html`, and backups are interchangeable with the
  browser edition.

### Changed

- A new month now carries each person's cadre and fixed-pattern flag forward, not
  just their name.

## [1.0] — 2026-09-08

First public release: an offline, single-file duty roster app replacing the
hand-filled Word/paper roster for the OPD & EMD departments.

### Added

- **Shift painting** — M / D / E / N / M-E / ENT / ECHO / Off / Leave, filled by
  click or drag, right-click to erase.
- **Balance assistant** — fairness table against the team average, rest-rule warnings
  (more than 6 consecutive workdays, night→morning turnarounds), per-day coverage
  counts, and one-click fill suggestions shown as grey ghosts to accept or discard.
  Staff on a fixed pattern can be excluded from it entirely.
- **Clinic rotations** — ENT and ECHO count as work for rest rules but not as OPD
  coverage.
- **Cadre badges** — SP / MD / INT / CO shown on the sheet and in the CSV.
- **Leave planner**, **pattern fill**, **shift swap**, and a **manual highlighter**
  for priority cells.
- **Tanzania public holidays** — fixed dates plus Good Friday and Easter Monday
  computed automatically; any day can be toggled as a custom holiday.
- **Exports** — A4-landscape print/PDF with a colour or ink-saving mode, PNG image,
  Excel-safe CSV, and JSON backup/restore that can save straight to a chosen file.
- **Per-person share** — formatted WhatsApp text and an `.ics` calendar file with
  per-shift reminders.
