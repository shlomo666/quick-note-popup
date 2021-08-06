const path = require('path');
const { FileHandler } = require('../common/FileHandler');
const appDir = path.dirname(require.main.filename);

const shortcutFilePath = `${appDir}/main/store/shortcut.txt`;

exports.shortcutHandler = new FileHandler(shortcutFilePath);
