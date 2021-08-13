const { noteElementsHandler } = require('./elements');
const { notesFileHandler } = require('./notesFileHandler');
const { currentNoteHandler } = require('./currentNoteHandler');

class NotesHandler {
  init() {
    this.__setHTML();
  }

  getNotes() {
    return notesFileHandler.getNotes();
  }

  setNotes(notes) {
    notesFileHandler.setNotes(notes);

    this.__setHTML();
  }

  addNote() {
    const note = currentNoteHandler.getValue();
    if (note.length === 0) {
      return;
    }

    const newNotes = [...this.getNotes(), note];
    this.setNotes(newNotes);
    currentNoteHandler.resetNote();
  }

  removeNote() {
    if (noteElementsHandler.selectionActive) {
      const { index } = noteElementsHandler;
      const newNotes = this.getNotes().filter((_note, i) => i !== index);
      this.setNotes(newNotes);
    }
  }

  up() {
    noteElementsHandler.up();
  }

  down() {
    noteElementsHandler.down();
  }

  resetEditState() {
    noteElementsHandler.resetEditState();
  }

  isEditing() {
    return currentNoteHandler.isEditing();
  }

  __setHTML() {
    noteElementsHandler.setNoteElements(this.getNotes());
  }
}

exports.notesHandler = new NotesHandler();
