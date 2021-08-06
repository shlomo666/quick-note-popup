const { ipcRenderer } = require('electron');
const { noteElementsHandler } = require('./preload/elements');
const { notesHandler } = require('./preload/notesHandler');

function setHTML() {
  noteElementsHandler.setNoteElements(notesHandler.getNotes());
}

window.addEventListener('DOMContentLoaded', () => {
  const note = document.getElementById('note');
  enforceFocusOnElement(note);
  setHTML();

  note.onkeyup = (event) => {
    const { key } = event;

    if (key === 'Enter' && note.value) {
      notesHandler.appendNote(note.value);
      note.value = '';
      setHTML();
    } else if (key === 'Escape') {
      note.value = '';
      ipcRenderer.send('hide');
    } else if (key === 'Backspace') {
      if (noteElementsHandler.selectionActive) {
        const notes = [...notesHandler.getNotes()];
        notes.splice(noteElementsHandler.index, 1);
        notesHandler.setValue(notes);
        setHTML();
      }
    }
  };

  note.onkeydown = (event) => {
    const { key } = event;

    if (key === 'ArrowDown') {
      noteElementsHandler.down();
    } else if (key === 'ArrowUp') {
      noteElementsHandler.up();
    }
  };
});

function enforceFocusOnElement(element) {
  element.focus();
  window.onfocus = () => {
    setTimeout(() => {
      element.focus();
    });
  };
}
