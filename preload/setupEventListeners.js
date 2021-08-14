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
    ArrowDown: () => stateHandler.down()
  };

  [
    ['keyup', keyUpEventsMap],
    ['keydown', keyDownEventsMap]
  ].map(([event, map]) => {
    stateHandler.setupEvent(event, (event) => {
      const { key } = event;

      const listener = map[key];
      if (listener) {
        listener();
      }
    });
  });
}

exports.setupEventListeners = setupEventListeners;
