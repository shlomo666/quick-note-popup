class CurrentNoteHandler {
  constructor() {
    /** @type {HTMLInputElement} */
    this.note = null;
  }

  init() {
    this.note = document.getElementById('note');
    this.enforceFocus();
  }

  addEventListener(event, action) {
    this.note.addEventListener(event, action);
  }

  get value() {
    return this.note.value;
  }

  resetEditState() {
    this.resetNote();
  }

  resetNote() {
    this.note.value = '';
  }

  get isEditing() {
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
