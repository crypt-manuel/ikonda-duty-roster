# Changelog

All notable changes to the Duty Roster app. Versions follow the GitHub releases at
<https://github.com/crypt-manuel/ikonda-duty-roster/releases>.

## [Unreleased]

### Changed

- **The toolbar hint is now one line plus a "Keyboard & tips" button.** It had grown
  into a paragraph of run-on text as features were added. The full guidance moved into
  a help dialog laid out in three sections — mouse, keyboard, and undo — with the
  shortcuts shown as key caps instead of buried in prose.

## [1.2] — 2026-09-09

Released as the single-file `duty-roster.html` only. The desktop (Electron) app was
not rebuilt for this version — the published desktop builds are still v1.1 and do not
include these changes.

### Added

- **Undo / redo** — `Ctrl+Z` and `Ctrl+Y` (or the toolbar buttons) step back through
  shift edits, including the ones that were previously impossible to take back:
  Clear month, Copy last month, pattern fill, leave, accepting or discarding
  suggestions, and staff changes. A whole drag-paint counts as one step, and each
  button names the action it will undo. Undoing an edit made in another month
  switches back to that month first. History is kept in memory for the session and
  is not saved with the roster; typing in the Staff list or the NOTES box still uses
  the browser's own undo.
- **Cadre-aware night checks** — the balance assistant now also flags a night with
  nobody at MD level or above, and an intern left on night alone. These only run once
  cadres are set in the Staff list, so rosters that don't use them see no change.

### Changed

- **Fill suggestions now follow your staffing, not a built-in rotation.** The old
  engine assumed a four-day M→E→N→D cycle, which the department does not work. It
  now reads how many people you put on each shift from the days you have already
  filled in — with a separate, usually lighter profile for Sundays and public
  holidays — and fills the rest of the month to match, giving each shift to whoever
  is owed it most while keeping people on a block of the same shift. It still never
  asks for a seventh day in a row or a morning straight after a night, never touches
  fixed-pattern (⟳) staff, and now says in the balance panel what levels it used.
  Fill in a representative week first for the closest match.

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
