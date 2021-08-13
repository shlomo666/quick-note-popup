const { currentNoteHandler } = require('./preload/currentNoteHandler');
const { notesHandler } = require('./preload/notesHandler');
const { setupEventListeners } = require('./preload/setupEventListeners');

window.addEventListener('DOMContentLoaded', () => {
  notesHandler.init();
  currentNoteHandler.init();
  setupEventListeners();
});
