const { ipcRenderer } = require('electron');
const { notesHandler } = require('./preload/notesHandler');
const { setupEventListeners } = require('./preload/setupEventListeners');
const { stateHandler } = require('./preload/stateHandler');

window.addEventListener('DOMContentLoaded', () => {
  stateHandler.init({ notes: notesHandler.getNotes(), onHide: () => ipcRenderer.send('hide') });
  setupEventListeners();
});
