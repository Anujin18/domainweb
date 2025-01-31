// Create a class for the custom WordCount element
class WordCount extends HTMLParagraphElement {
    constructor() {
      super();
  
      const wcParent = this.parentNode;
  
      // Function to count words
      function countWords(node) {
        const text = node.innerText || node.textContent;
        return text.trim().split(/\s+/g).filter(a => a.trim().length > 0).length;
      }
  
      const count = `Words: ${countWords(wcParent)}`;
  
      // Create shadow DOM
      const shadow = this.attachShadow({ mode: 'open' });
  
      // Create text node to show word count
      const text = document.createElement('span');
      text.textContent = count;
  
      // Append it to shadow root
      shadow.appendChild(text);
  
      // Update count when content changes
      this.parentNode.addEventListener('input', () => {
        text.textContent = `Words: ${countWords(wcParent)}`;
      });
    }
  }
  
  // Define the custom element
  customElements.define('word-count', WordCount, { extends: 'p' });
  
  // Adding the WordCount element to the description input
  const descriptionInputElement = document.getElementById('description-input');
  const wordCountElement = document.createElement('p', { is: 'word-count' });
  descriptionInputElement.parentNode.appendChild(wordCountElement);
  