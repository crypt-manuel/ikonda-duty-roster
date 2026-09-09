# Duty Roster — Electron edition

A desktop wrapper around the same **`duty-roster.html`** that runs in Chrome/Edge.
The HTML file remains the single source of truth: this folder contains **no roster
code**, only a window shell. `sync.js` copies the current `../duty-roster.html`
into `app/` before every start and build, so every fix to the HTML automatically
lands in the desktop app too.

## Why use this instead of the plain HTML?

- One icon to double-click — no browser needed on the machine.
- Roster data lives in the app's own profile, safe from browser cache clean-ups.
- Installer (`DutyRoster-setup-*.exe`) or **portable single exe**
  (`DutyRoster-portable-*.exe`) that runs from a flash drive.

Four artifacts are built (`npm run dist`):

| Artifact | What it is |
| --- | --- |
| `DutyRoster-setup-1.1.0.exe` | one-click installer (Start-menu entry) |
| `DutyRoster-portable-1.1.0.exe` | single self-extracting exe, no install |
| `DutyRoster-1.1.0-win-x64.zip` | the unpacked app folder — **unzip and run `Duty Roster.exe`** |
| `DutyRoster-1.1.0-win-x64.tar.gz` | same folder as a gzipped tarball |

The **zip/tar.gz archives are the friendliest downloads**: browsers and email
filters often block or warn on a bare `.exe`, but pass an archive through. They
contain the whole app directory, so keep the files together — extract the folder
somewhere (a flash drive is fine) and launch `Duty Roster.exe` inside it.

Backups are the same `.json` files in both editions — you can move between the
HTML and the Electron app at any time via **⬇ Backup / ⬆ Restore**.

## Develop / run from source

```bash
cd electron
npm install
npm start          # syncs ../duty-roster.html and opens the app
```

## Build the Windows exe

```bash
npm run dist       # NSIS installer + portable exe into electron/dist/
```

For a private build with the real Ikonda staff list pre-filled:

```bash
node sync.js --local && npx electron-builder --win
```

(that bundles `../local/duty-roster-ikonda.html`; never publish those artifacts).

## SmartScreen and code signing

Windows SmartScreen warns about **downloaded** unsigned apps. Practical notes:

- **Flash-drive installs never trigger it.** SmartScreen only checks files carrying
  the "Mark of the Web", which Windows attaches to internet downloads on NTFS.
  A portable exe copied from a FAT32 USB stick has no such mark — the intended
  hospital deployment shows **no warning at all**.
- For a downloaded file: **right-click → Properties → tick "Unblock"** removes the
  mark, or click *More info → Run anyway* once; SmartScreen remembers per machine.
- **Self-signed certificates do not help** — SmartScreen is reputation-based, not
  signature-based. A self-signed cert only removes "Unknown publisher" on PCs where
  the cert was manually installed as trusted (viable inside one hospital, useless
  for public downloads).
- Real options, in order of cost:
  1. **SignPath Foundation** (<https://signpath.org>) — **free** code signing for
     open-source projects; this repo (MIT, public GitHub) fits their criteria.
     Requires an application and signing through their service.
  2. **Azure Trusted Signing** — ~US$10/month, Microsoft-trusted signatures with
     good SmartScreen standing; identity validation currently supports a limited
     set of countries for individuals.
  3. **OV certificate** (Certum "Open Source" ~€40/yr, Sectigo/SSL.com ~$100+/yr) —
     signs the app but SmartScreen reputation still builds gradually per file.
  4. **EV certificate** (~$250–500/yr) — near-immediate SmartScreen reputation.
- Unsigned apps also earn reputation as downloads/runs of the same exe accumulate;
  each new release starts over.

## Notes

- `app/` and `dist/` are generated and gitignored.
- Version in `package.json` should track `APP_VERSION` in the HTML.
- No auto-update, no network access — the app is fully offline by design.
