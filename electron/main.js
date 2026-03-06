const { app, BrowserWindow } = require('electron');
const path = require('path');

// Adres aplikacji (frontend na Renderze). Można nadpisać przez zmienną środowiskową przy budowaniu.
const APP_URL = process.env.ELECTRON_APP_URL || 'https://csmchecklist-frontend.onrender.com';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 400,
    minHeight: 500,
    ...(require('fs').existsSync(path.join(__dirname, 'icon.png')) && { icon: path.join(__dirname, 'icon.png') }),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'CSM Checklist - Pielęgniarstwo',
    show: false,
  });

  mainWindow.loadURL(APP_URL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
