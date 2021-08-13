const { ipcRenderer } = require('electron');
const { notesHandler } = require('./notesHandler');
const { currentNoteHandler } = require('./currentNoteHandler');

function setupEventListeners() {
  const keyUpEventsMap = {
    Enter: () => {
      if (notesHandler.isEditing()) {
        notesHandler.addNote();
      } else {
        hide();
      }
    },
    Escape: () => {
      hide();
    },
    Backspace: () => notesHandler.removeNote()
  };
  const keyDownEventsMap = {
    ArrowUp: () => notesHandler.up(),
    ArrowDown: () => notesHandler.down()
  };

  [
    ['keyup', keyUpEventsMap],
    ['keydown', keyDownEventsMap]
  ].map(([event, map]) => {
    currentNoteHandler.addEventListener(event, (event) => {
      const { key } = event;

      const listener = map[key];
      if (listener) {
        listener();
      }
    });
  });
}

exports.setupEventListeners = setupEventListeners;
function hide() {
  currentNoteHandler.resetEditState();
  notesHandler.resetEditState();
  ipcRenderer.send('hide');
}
