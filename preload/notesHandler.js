const { notesFileHandler } = require('./notesFileHandler');
const { stateHandler } = require('./stateHandler');

class NotesHandler {
  getNotes() {
    return notesFileHandler.getNotes();
  }

  __setNotes(notes) {
    notesFileHandler.setNotes(notes);

    stateHandler.setList(notes);
  }

  addNote() {
    if (!stateHandler.isEditing) {
      return;
    }
    const note = stateHandler.currentNote;

    const newNotes = [...this.getNotes(), note];
    this.__setNotes(newNotes);
    stateHandler.resetNote();
  }

  removeNote() {
    if (stateHandler.selectionActive) {
      const index = stateHandler.selectedIndex;
      const newNotes = this.getNotes().filter((_note, i) => i !== index);
      this.__setNotes(newNotes);
    }
  }

  __moveNote(direction) {
    if (stateHandler.selectionActive) {
      const oldIndex = stateHandler.selectedIndex;
      const newNotes = [...this.getNotes()];
      const newIndex = oldIndex + direction;
      if (newIndex < 0 || newIndex >= newNotes.length) {
        return false;
      }
      const note = newNotes[oldIndex];
      [newNotes[oldIndex], newNotes[newIndex]] = [newNotes[newIndex], note];
      this.__setNotes(newNotes);

      return true;
    }
  }

  noteUp() {
    return this.__moveNote(-1);
  }

  noteDown() {
    return this.__moveNote(1);
  }

  duplicateNote() {
    if (stateHandler.selectionActive) {
      const newNotes = this.getNotes();
      newNotes.splice(stateHandler.selectedIndex, 0, newNotes[stateHandler.selectedIndex]);
      this.__setNotes(newNotes);
    }
  }
}

exports.notesHandler = new NotesHandler();
