"use strict";
/* Headless smoke test: loads the bundled roster, verifies it rendered, exits.
   Run with: npx electron smoke.js   (not part of the packaged app) */
const { app, BrowserWindow } = require("electron");
const path = require("path");

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true }
  });
  win.webContents.on("console-message", (e, level, msg) => {
    if (level >= 2) console.log("[renderer " + level + "] " + msg);
  });
  try {
    await win.loadFile(path.join(__dirname, "app", "duty-roster.html"));
    const r = await win.webContents.executeJavaScript(`({
      title: document.title,
      month: document.getElementById("monthTitle").textContent,
      dayCells: document.querySelectorAll("td.day").length,
      cloneBtn: !!document.getElementById("cloneBtn"),
      savedAt: document.getElementById("savedAt").textContent,
      html2canvas: typeof html2canvas,
      fsApi: typeof window.showSaveFilePicker,
      localStorageOk: (()=>{ try{ localStorage.setItem("_smoke","1"); localStorage.removeItem("_smoke"); return true; }catch(e){ return false; } })()
    })`, true);
    console.log("SMOKE: " + JSON.stringify(r, null, 1));
    app.exit(r.dayCells > 0 && r.localStorageOk ? 0 : 1);
  } catch (err) {
    console.error("SMOKE FAILED: " + err);
    app.exit(1);
  }
});
