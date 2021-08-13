const { EOL } = require('os');
const { FileHandler } = require('../common/FileHandler');

const notesFilePath = `${__dirname}/store/notes.txt`;

class NotesFileHandler extends FileHandler {
  getNotes() {
    return this.getValue();
  }

  setNotes(notes) {
    return this.setValue(notes);
  }

  deserializeValue(fileContent) {
    const notes = fileContent.split(EOL).filter((note) => note.trim());
    return notes;
  }

  serializeValue(notes) {
    const fileContent = notes.join(EOL);
    return fileContent;
  }
}
exports.notesFileHandler = new NotesFileHandler(notesFilePath);
