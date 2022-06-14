const { notesHandler } = require('./notesHandler');
const { stateHandler } = require('./stateHandler');

function setupEventListeners() {
  let lastCharWasJustDeleted = false;

  /** @type {Record<keyof HTMLElementEventMap, Record<string, (event: KeyboardEvent) => void>>} */
  const eventsMap = {
    keyup: {
      Enter: () => {
        if (stateHandler.isEditing) {
          notesHandler.addNote();
        } else {
          stateHandler.hide();
        }
      },
      Escape: () => stateHandler.hide(),
      Backspace: () => {
        if (!stateHandler.isEditing && !lastCharWasJustDeleted) {
          notesHandler.removeNote();
        }
        lastCharWasJustDeleted = false;
      }
    },
    keydown: {
      ArrowUp: (event) => {
        let moveStateUp = true;

        if (event.altKey) {
          if (event.shiftKey) {
            notesHandler.duplicateNote();
            moveStateUp = false;
          } else {
            moveStateUp = notesHandler.noteUp();
          }
        }
        if (moveStateUp) {
          stateHandler.up();
        }
      },
      ArrowDown: (event) => {
        let moveStateDown = true;

        if (event.altKey) {
          if (event.shiftKey) {
            notesHandler.duplicateNote();
            moveStateDown = true;
          } else {
            moveStateDown = notesHandler.noteDown();
          }
        }
        if (moveStateDown) {
          stateHandler.down();
        }
      },
      Backspace: (event) => {
        if (stateHandler.currentNote.length === 1) {
          lastCharWasJustDeleted = true;
        }
      }
    }
  };

  Object.entries(eventsMap).forEach(([event, map]) => {
    stateHandler.setupEvent(event, (event) => {
      const { key } = event;

      const listener = map[key];
      listener?.(event);
    });
  });
}

exports.setupEventListeners = setupEventListeners;
