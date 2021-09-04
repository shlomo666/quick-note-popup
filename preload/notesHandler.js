const { notesFileHandler } = require('./notesFileHandler');
const { stateHandler } = require('./stateHandler');
const { swapArrItems } = require('../common/utils');

class NotesHandler {
  /** @returns {string[]} notes */
  getNotes() {
    return notesFileHandler.getNotes();
  }

  __setNotes(notes) {
    notesFileHandler.setNotes(notes);
    stateHandler.setList(notes);
  }

  /** @param {(notes: string[]) => void} changer */
  __changeNotes(changer) {
    const notes = [...this.getNotes()];
    changer(notes);
    this.__setNotes(notes);
  }

  __isIndexOutOfBounds(index) {
    return index < 0 || index >= this.getNotes().length;
  }

  addNote() {
    if (!stateHandler.isEditing) {
      return;
    }

    this.__changeNotes((notes) => {
      const note = stateHandler.currentNote;

      if (stateHandler.selectionActive) {
        this.__insertAfterSelection(notes, note);
      } else {
        this.__insertAtBottom(notes, note);
      }
    });

    stateHandler.resetNote();
  }

  /** @param {string[]} notes */
  /** @param {string} note */
  __insertAtBottom(notes, note) {
    notes.push(note);
  }

  /** @param {string[]} notes */
  /** @param {string} note */
  __insertAfterSelection(notes, note) {
    const indexOfNewNote = stateHandler.selectedIndex + 1;
    notes.splice(indexOfNewNote, 0, note);
  }

  removeNote() {
    if (stateHandler.selectionActive) {
      const index = stateHandler.selectedIndex;
      this.__changeNotes((notes) => {
        notes.splice(index, 1);
      });
    }
  }

  __moveNote(direction) {
    if (stateHandler.selectionActive) {
      const fromIndex = stateHandler.selectedIndex;
      const toIndex = fromIndex + direction;
      if (this.__isIndexOutOfBounds(toIndex)) {
        return false;
      }
      this.__changeNotes((notes) => {
        swapArrItems(notes, fromIndex, toIndex);
      });

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
      this.__changeNotes((notes) => {
        const index = stateHandler.selectedIndex;
        const selectedNote = notes[index];
        notes.splice(index, 0, selectedNote);
      });
    }
  }
}

exports.notesHandler = new NotesHandler();
