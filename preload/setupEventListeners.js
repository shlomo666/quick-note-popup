const { notesHandler } = require('./notesHandler');
const { stateHandler } = require('./stateHandler');

function setupEventListeners() {
  const keyUpEventsMap = {
    Enter: () => {
      if (stateHandler.isEditing) {
        notesHandler.addNote();
      } else {
        stateHandler.hide();
      }
    },
    Escape: () => stateHandler.hide(),
    Backspace: () => notesHandler.removeNote()
  };
  const keyDownEventsMap = {
    ArrowUp: () => stateHandler.up(),
    ArrowDown: () => stateHandler.down(),
    /** @param {KeyboardEvent} event */
    Backspace: (event) => {
      if (stateHandler.selectionActive) {
        event.preventDefault();
      }
    }
  };

  [
    ['keyup', keyUpEventsMap],
    ['keydown', keyDownEventsMap]
  ].forEach(([event, map]) => {
    stateHandler.setupEvent(event, (event) => {
      const { key } = event;

      const listener = map[key];
      listener?.(event);
    });
  });
}

exports.setupEventListeners = setupEventListeners;
