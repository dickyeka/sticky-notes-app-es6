class StickyNotesApp {

  constructor() {
    this.notesContainer = document.getElementById('notes-container');
    this.noteMessageInput = document.getElementById('message');
    this.addNoteButton = document.getElementById('save');
    this.notesSectionTitle = document.getElementById('notes-section-title');

    this.addNoteButton.addEventListener('click', () => this.saveNote());

    this.noteMessageInput.addEventListener('keyup', () => this.toggleButton());

    for (let key in localStorage) {
      this.displayNote(key, localStorage[key]);
    }
    window.addEventListener('storage', e => this.displayNote(e.key, e.newValue));

  }

  saveNote() {
    if (this.noteMessageInput.value) {
      let key = Date.now().toString();
      localStorage.setItem(key, this.noteMessageInput.value);
      this.displayNote(key, this.noteMessageInput.value);
      StickyNotesApp.resetMaterialTextfield(this.noteMessageInput);
      this.toggleButton();
    }
  }

  static resetMaterialTextfield(element) {
    element.value = '';
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
    element.blur();
  }

  displayNote(key, message) {
    let note = document.getElementById(key);
    if(!note){
        note = document.createElement('sticky-note');
        note.id = key;
        this.notesContainer.insertBefore(note, this.notesSectionTitle.nextSibling);
    }
    if (!message) {
      return note.deleteNote();
    }
    note.setMessage(message);
  };

  toggleButton() {
    if (this.noteMessageInput.value) {
      this.addNoteButton.removeAttribute('disabled');
    } else {
      this.addNoteButton.setAttribute('disabled', 'true');
    }
  }
}

window.addEventListener('load', () => new StickyNotesApp());


class StickyNote extends HTMLElement {

  createdCallback() {
    this.classList.add(...StickyNote.CLASSES);
    this.innerHTML = StickyNote.TEMPLATE;
    this.messageElement = this.querySelector('.message');
    this.dateElement = this.querySelector('.date');
    this.deleteButton = this.querySelector('.delete');
    this.deleteButton.addEventListener('click', () => this.deleteNote());
  }

  attributeChangedCallback(attributeName) {
    if (attributeName == 'id') {
      let date;
      if (this.id) {
        date = new Date(parseInt(this.id));
      } else {
        date = new Date();
      }

      let dateFormatterOptions = {day: 'numeric', month: 'short'};
      let shortDate = new Intl.DateTimeFormat("en-US", dateFormatterOptions).format(date);

      this.dateElement.textContent = `Created on ${shortDate}`;
    }
  }

  setMessage(message) {
    this.messageElement.textContent = message;
    this.messageElement.innerHTML = this.messageElement.innerHTML.replace(/\n/g, '<br>');
  }

  deleteNote() {
    localStorage.removeItem(this.id);
    this.parentNode.removeChild(this);
  }
}

StickyNote.TEMPLATE = `
    <div class="message"></div>
    <div class="date"></div>
    <button class="delete mdl-button mdl-js-button mdl-js-ripple-effect">
      Delete
    </button>`;

StickyNote.CLASSES = ['mdl-cell--4-col-desktop', 'mdl-card__supporting-text', 'mdl-cell--12-col',
  'mdl-shadow--2dp', 'mdl-cell--4-col-tablet', 'mdl-card', 'mdl-cell', 'sticky-note'];

document.registerElement('sticky-note', StickyNote);

