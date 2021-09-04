const clamp = require('lodash.clamp');
const { scroll, listElementId, selectedItemColor, itemColor } = require('./consts');

class NoteElementsHandler {
  constructor() {
    this.texts = [];
    this._index = -1;
  }

  get index() {
    return this._index;
  }

  set index(index) {
    this._index = clamp(index, -1, this.texts.length - 1);
    this.__setHTML();
  }

  /** @param {string[]} texts */
  setNoteElements(texts) {
    this.texts = texts;
    // clamp index to the new length
    // eslint-disable-next-line no-self-assign
    this.index = this.index;
  }

  __setHTML() {
    replaceHTML({ selector: listElementId, text: this.__getUnorderedList(this.texts) });
  }

  /** @param {string[]} texts */
  __getUnorderedList(texts) {
    return ul(texts.map((text, i) => li(span(text, `font-size: 30px; color: ${this.__getNoteColor(i)}`))).join('\n'));
  }

  /** @param {number} index */
  __getNoteColor(index) {
    return index === this.index ? selectedItemColor : itemColor;
  }

  down() {
    this.index++;

    const { selectedItemSurroundingLines } = scroll;
    this.__scrollTo(this.index + selectedItemSurroundingLines);
  }

  up() {
    this.index--;

    const { selectedItemSurroundingLines } = scroll;
    this.__scrollTo(this.index - selectedItemSurroundingLines);
  }

  __scrollTo(index) {
    const ul = document.querySelector('ul');

    const indexOfElementToBeVisible = index;
    const min = 0;
    const indexOfElementToScrollTo = Math.max(indexOfElementToBeVisible, min);

    const elementToScrollTo = ul.children[indexOfElementToScrollTo];
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoViewIfNeeded({ behavior: 'smooth' });
    }
  }

  get selectionActive() {
    return this.index > -1;
  }

  get selectedIndex() {
    return this.index;
  }

  resetEditState() {
    this.index = -1;
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
