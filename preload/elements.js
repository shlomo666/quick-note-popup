const clamp = require('lodash.clamp');

class NoteElementsHandler {
  constructor() {
    this.texts = [];
    this.index = -1;
  }

  /**
   * @param {string[]} texts
   */
  setNoteElements(texts) {
    this.texts = texts;
    this.index = clamp(this.index, -1, this.texts.length - 1);
    this.setHTML();
  }

  setHTML() {
    replaceHTML({ selector: 'results', text: this.getUnorderedList(this.texts) });
  }

  /**
   * @param {string[]} texts
   */
  getUnorderedList(texts) {
    return ul(texts.map((text, i) => li(span(text, `font-size: 30px; color: ${this.getNoteColor(i)}`))).join('\n'));
  }

  getNoteColor(index) {
    return index === this.index ? 'cornflowerblue' : 'white';
  }

  down() {
    this.index = clamp(this.index + 1, -1, this.texts.length - 1);
    this.setHTML();
  }

  up() {
    this.index = clamp(this.index - 1, -1, this.texts.length - 1);
    this.setHTML();
  }

  get selectionActive() {
    return this.index > -1;
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
