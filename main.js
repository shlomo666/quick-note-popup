// Modules to control application life and create native browser window
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const actions = require('./main/actions');
const tray = require('./main/tray');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    center: true,
    transparent: true,
    frame: false,
    show: false
  });

  app.dock?.hide();
  mainWindow.setAlwaysOnTop(true, 'floating');
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setFullScreenable(false);
  tray.setTray(mainWindow);

  setTimeout(() => {
    actions.show(mainWindow);
  }, 1000);

  mainWindow.on('blur', () => actions.hide(mainWindow));
  ipcMain.on('hide', () => actions.hide(mainWindow));

  mainWindow.loadFile('index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
