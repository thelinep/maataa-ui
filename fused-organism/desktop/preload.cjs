const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("maataaDesktop", Object.freeze({
  isDesktop: true,
  platform: process.platform,
  electronVersion: process.versions.electron,
}));
