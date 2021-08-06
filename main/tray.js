const { Tray, Menu, app } = require('electron');
const path = require('path');
const { shortcutHandler } = require('./shortcutHandler');

const appDir = path.dirname(require.main.filename);
const package = require(appDir + '/package.json');

/** @type {Electron.Tray} */
let tray;
exports.setTray = () => {
  if (!tray) {
    tray = new Tray(appDir + '/menu_bar_icon.png');
  }
  tray.setToolTip(package.productName);
  const shortcut = shortcutHandler.getValue();
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Shortcut',
        submenu: Menu.buildFromTemplate(
          ['alt+1', 'alt+q', 'alt+t'].map((key) => ({ label: key, click: () => shortcutHandler.setValue(key), type: 'radio', checked: key === shortcut }))
        ),
      },
      {
        label: 'Quit',
        click: () => app.quit(),
      },
    ])
  );
};
