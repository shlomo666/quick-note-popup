const { currentNoteHandler } = require('./currentNoteHandler');
const { noteElementsHandler } = require('./noteElementsHandler');

class StateHandler {
  init({ notes, onHide }) {
    this.onHide = onHide;
    currentNoteHandler.init();
    this.setList(notes);
  }

  /**
   * @param {string} event
   * @param {(event: { key: string }) => void} action
   * */
  setupEvent(event, action) {
    currentNoteHandler.addEventListener(event, action);
  }

  hide() {
    this.resetEditState();
    this.onHide();
  }

  up() {
    noteElementsHandler.up();
  }

  down() {
    noteElementsHandler.down();
  }

  resetEditState() {
    noteElementsHandler.resetEditState();
    currentNoteHandler.resetEditState();
  }

  get selectionActive() {
    return noteElementsHandler.selectionActive;
  }

  get selectedIndex() {
    return noteElementsHandler.selectedIndex;
  }

  setList(list) {
    noteElementsHandler.setNoteElements(list);
  }

  get isEditing() {
    return currentNoteHandler.isEditing;
  }

  get currentNote() {
    return currentNoteHandler.value;
  }

  resetNote() {
    currentNoteHandler.resetNote();
  }
}

exports.stateHandler = new StateHandler();
