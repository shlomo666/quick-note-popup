const { EOL } = require('os');
const { FileHandler } = require('../common/FileHandler');

const notesFilePath = `${__dirname}/store/notes.txt`;

class NotesHandler extends FileHandler {
  getNotes() {
    return this.getValue();
  }

  getValue() {
    return super
      .getValue()
      .split(EOL)
      .filter((note) => note.trim());
  }

  appendNote(note) {
    this.setValue([...this.getValue(), note]);
  }

  __setValue(notes) {
    super.__setValue(notes.join(EOL));
  }
}
exports.notesHandler = new NotesHandler(notesFilePath);
