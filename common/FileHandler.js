const { readFileSync, writeFileSync } = require('fs');

class FileHandler {
  /** @param {string} filePath */
  constructor(filePath) {
    this.filePath = filePath;
    /** @type {(event: { oldValue: string; value: string }) => void} */
    this.onValueChanged = () => {};
  }

  getValue() {
    const buf = readFileSync(this.filePath);
    return buf.toString();
  }

  setValue(newValue) {
    const oldValue = this.getValue();
    this.__setValue(newValue);
    this.onValueChanged({ oldValue, value: newValue });
  }

  __setValue(newValue) {
    writeFileSync(this.filePath, newValue);
  }
}

exports.FileHandler = FileHandler;
