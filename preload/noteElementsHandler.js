const clamp = require('lodash.clamp');

const LIST_ELEMENT_ID = 'listElement';

class NoteElementsHandler {
  constructor() {
    this.texts = [];
    this.index = -1;
  }

  /** @param {string[]} texts */
  setNoteElements(texts) {
    this.texts = texts;
    this.index = clamp(this.index, -1, this.texts.length - 1);
    this.__setHTML();
  }

  __setHTML() {
    replaceHTML({ selector: LIST_ELEMENT_ID, text: this.__getUnorderedList(this.texts) });
  }

  /** @param {string[]} texts */
  __getUnorderedList(texts) {
    return ul(texts.map((text, i) => li(span(text, `font-size: 30px; color: ${this.__getNoteColor(i)}`))).join('\n'));
  }

  /** @param {number} index */
  __getNoteColor(index) {
    return index === this.index ? 'cornflowerblue' : 'white';
  }

  down() {
    this.index = clamp(this.index + 1, -1, this.texts.length - 1);
    this.__setHTML();
  }

  up() {
    this.index = clamp(this.index - 1, -1, this.texts.length - 1);
    this.__setHTML();
  }

  get selectionActive() {
    return this.index > -1;
  }

  get selectedIndex() {
    return this.index;
  }

  resetEditState() {
    this.index = -1;
    this.__setHTML();
  }
}

exports.noteElementsHandler = new NoteElementsHandler();

/**
 * @param {string} text
 */
function ul(text) {
  return `<ul>${text}</ul>`;
}

/**
 * @param {string} text
 */
function li(text) {
  return `<li style="margin: 0 0 3px 0">${text}</li>`;
}

/**
 * @param {string} text
 * @param {string} style
 */
function span(text, style) {
  return `<span style="${style}">${text}</span>`;
}

/**
 * @param {string} selector
 * @param {string} text
 */
function replaceHTML({ selector, text }) {
  const element = document.getElementById(selector);
  if (element) {
    element.innerHTML = text;
  }
}
