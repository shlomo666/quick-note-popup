const { globalShortcut, screen, shell } = require('electron');
const { shortcutFileHandler: shortcutHandler } = require('./shortcutFileHandler');
const { notesFilePath } = require('../preload/notesFileHandler');

const { getCursorScreenPoint, getDisplayNearestPoint } = screen;

let registeredCallback;

shortcutHandler.onValueChanged = ({ value, oldValue }) => {
  if (registeredCallback) {
    globalShortcut.unregister(oldValue);
    globalShortcut.register(value, registeredCallback);
  }
};

/** @param {Electron.BrowserWindow} win */
exports.hide = (win) => {
  win.hide();

  registeredCallback = () => {
    exports.show(win);
  };
  globalShortcut.register(shortcutHandler.getValue(), registeredCallback);
};

/** @param {Electron.BrowserWindow} win */
exports.show = (win) => {
  globalShortcut.unregister(shortcutHandler.getValue());
  registeredCallback = null;

  const currentScreen = getDisplayNearestPoint(getCursorScreenPoint());
  const { x, y } = currentScreen.workArea;
  win.setBounds({ x, y });
  win.center();
  win.focus();
  win.show();
};

exports.openNotesFile = () => {
  shell.openItem(notesFilePath);
};
