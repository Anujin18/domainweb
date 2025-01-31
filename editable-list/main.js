'use strict';

(function() {
  class EditableList extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // attaches shadow tree and returns shadow root reference
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
      const shadow = this.attachShadow({ mode: 'open' });

      // creating a container for the editable-list component
      const editableListContainer = document.createElement('div');

      // get attribute values from getters
      const title = this.title;
      const addItemText = this.addItemText;
      const listItems = this.items;

      // adding a class to our container for the sake of clarity
      editableListContainer.classList.add('editable-list');

      // creating the inner HTML of the editable list element
      editableListContainer.innerHTML = `
        <style>
          li, div > div {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .icon {
            background-color: #fff;
            border: none;
            cursor: pointer;
            float: right;
            font-size: 1.8rem;
          }
        </style>
        <h3>${title}</h3>
        <ul class="item-list">
        </ul>
        <div>
          <label>${addItemText}</label>
          <input class="add-new-list-item-url" type="text" placeholder="Website URL">
          <button class="editable-list-add-item icon">&oplus;</button>
        </div
      `;

      // binding methods
      this.addListItem = this.addListItem.bind(this);
      this.handleRemoveItemListeners = this.handleRemoveItemListeners.bind(this);
      this.removeListItem = this.removeListItem.bind(this);

      // appending the container to the shadow DOM
      shadow.appendChild(editableListContainer);
    }

    // Adds a list item from user input
    addListItem() {
      const urlInput = this.shadowRoot.querySelector('.add-new-list-item-url');

      if (urlInput.value) {
        this.addListItemFromData(urlInput.value);;
        urlInput.value = '';
      }
    }
  
    // Adds a list item from predefined JSON data
    addListItemFromData(url) {
      const li = document.createElement('li');
      const button = document.createElement('button');

      li.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
      button.classList.add('editable-list-remove-item', 'icon');
      button.innerHTML = '&ominus;';

      this.itemList.appendChild(li);
      li.appendChild(button);

      this.handleRemoveItemListeners([button]);
    }

    connectedCallback() {
      const addElementButton = this.shadowRoot.querySelector('.editable-list-add-item');
      this.itemList = this.shadowRoot.querySelector('.item-list');

      addElementButton.addEventListener('click', this.addListItem, false);
    }

    get title() {
      return this.getAttribute('title') || '';
    }

    get addItemText() {
      return this.getAttribute('add-item-text') || '';
    }

    handleRemoveItemListeners(arrayOfElements) {
      arrayOfElements.forEach(element => {
        element.addEventListener('click', this.removeListItem, false);
      });
    }

    removeListItem(e) {
      e.target.parentNode.remove();
    }
  }

  // let the browser know about the custom element
  customElements.define('editable-list', EditableList);
})();