const { readFileSync, writeFileSync } = require('fs');

class FileHandler {
  /** @param {string} filePath */
  constructor(filePath) {
    this.filePath = filePath;
    /** @type {(event: { oldValue: string; value: string }) => void} */
    this.onValueChanged = () => {};
  }

  getValue() {
    return this.__getValue();
  }

  setValue(newValue) {
    const oldValue = this.getValue();
    this.__setValue(newValue);
    this.onValueChanged({ oldValue, value: newValue });
  }

  serializeValue(value) {
    return value;
  }

  deserializeValue(value) {
    return value;
  }

  __getValue() {
    const buf = readFileSync(this.filePath);
    return this.deserializeValue(buf.toString());
  }

  __setValue(newValue) {
    writeFileSync(this.filePath, this.serializeValue(newValue));
  }
}

exports.FileHandler = FileHandler;
