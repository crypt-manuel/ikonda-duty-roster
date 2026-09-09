"use strict";
const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("path");

// Single instance — a second launch just focuses the existing window
if (!app.requestSingleInstanceLock()) app.quit();

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 900,
    minHeight: 600,
    title: "Duty Roster",
    icon: path.join(__dirname, "icon.ico"),
    backgroundColor: "#dfe3ea",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      spellcheck: false
    }
  });
  win.maximize();
  win.loadFile(path.join(__dirname, "app", "duty-roster.html"));
  // external links (if any ever appear) open in the system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.on("closed", () => { win = null; });
}

function buildMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Print / PDF",
          accelerator: "CmdOrCtrl+P",
          click: () => win && win.webContents.executeJavaScript("window.print()", true)
        },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () =>
            dialog.showMessageBox(win, {
              type: "info",
              title: "About",
              message: "Duty Roster — Consolata Hospital Ikonda",
              detail:
                "Offline duty roster app (Electron edition).\n" +
                "App version " + app.getVersion() + "\n\n" +
                "The same roster also runs as a plain duty-roster.html file " +
                "in Chrome/Edge — both share the .json backup format.\n\n" +
                "https://github.com/crypt-manuel/ikonda-duty-roster"
            })
        },
        {
          label: "Project page (GitHub)",
          click: () => shell.openExternal("https://github.com/crypt-manuel/ikonda-duty-roster")
        }
      ]
    }
  ]));
}

app.on("second-instance", () => {
  if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
});
app.whenReady().then(() => { buildMenu(); createWindow(); });
app.on("window-all-closed", () => app.quit());
