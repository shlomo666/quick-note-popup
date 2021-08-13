class CurrentNoteHandler {
  constructor() {
    /** @type {HTMLInputElement} */
    this.note = null;
  }

  init() {
    this.note = document.getElementById('note');
    this.enforceFocus();
  }

  addEventListener(event, fn) {
    this.note.addEventListener(event, fn);
  }

  getValue() {
    return this.note.value;
  }

  resetEditState() {
    this.resetNote();
  }

  resetNote() {
    this.note.value = '';
  }

  isEditing() {
    return this.note.value !== '';
  }

  enforceFocus() {
    this.note.focus();
    window.onfocus = () => {
      setTimeout(() => {
        this.note.focus();
      });
    };
  }
}

exports.currentNoteHandler = new CurrentNoteHandler();
