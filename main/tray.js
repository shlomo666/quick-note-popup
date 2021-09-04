const path = require('path');
const { Tray, Menu, app } = require('electron');

const { openNotesFile } = require('./actions');
const { shortcutFileHandler: shortcutHandler } = require('./shortcutFileHandler');

const appDir = path.dirname(require.main.filename);
const packageJson = require(appDir + '/package.json');
const { productName } = packageJson;

/** @type {Electron.Tray} */
let tray;
exports.setTray = () => {
  if (!tray) {
    tray = new Tray(appDir + '/menu_bar_icon.png');
  }
  tray.setToolTip(productName);
  const shortcut = shortcutHandler.getValue();
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Shortcut',
        submenu: Menu.buildFromTemplate(
          ['alt+1', 'alt+q', 'alt+t'].map((key) => ({ label: key, click: () => shortcutHandler.setValue(key), type: 'radio', checked: key === shortcut }))
        )
      },
      {
        label: 'Open Notes File',
        click: () => openNotesFile()
      },
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ])
  );
};
