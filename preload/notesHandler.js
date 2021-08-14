const { notesFileHandler } = require('./notesFileHandler');
const { stateHandler } = require('./stateHandler');

class NotesHandler {
  getNotes() {
    return notesFileHandler.getNotes();
  }

  setNotes(notes) {
    notesFileHandler.setNotes(notes);

    stateHandler.setList(notes);
  }

  addNote() {
    if (!stateHandler.isEditing) {
      return;
    }
    const note = stateHandler.currentNote;

    const newNotes = [...this.getNotes(), note];
    this.setNotes(newNotes);
    stateHandler.resetNote();
  }

  removeNote() {
    if (stateHandler.selectionActive) {
      const index = stateHandler.selectedIndex;
      const newNotes = this.getNotes().filter((_note, i) => i !== index);
      this.setNotes(newNotes);
    }
  }
}

exports.notesHandler = new NotesHandler();
