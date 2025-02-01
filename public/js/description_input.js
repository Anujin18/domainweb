// Ashiglasan material: https://github.com/mdn/web-components-examples/blob/main/word-count-web-component
class WordCount extends HTMLParagraphElement {
    constructor() {
        super();
    
        const inputField = document.getElementById('description-input');

        function countWords(text) {
            return text.trim().split(/\s+/g).filter(a => a.trim().length > 0).length;
        }

        // Create shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // Create text node to show word count
        const text = document.createElement('span');
        text.textContent = `Words: 0`;
        text.style.color = 'black';

        shadow.appendChild(text);

        // Update count when content changes
        if (inputField) {
            text.textContent = `Words: ${countWords(inputField.value)}`;

            inputField.addEventListener('input', () => {
                text.textContent = `Words: ${countWords(inputField.value)}`;
            });
        }
    }
}
  
customElements.define('word-count', WordCount, { extends: 'p' });
  
// Ensure the description input exists before appending word count
document.addEventListener('DOMContentLoaded', () => {
    const descriptionInputElement = document.getElementById('description-input');
    if (descriptionInputElement) {
        const wordCountElement = document.createElement('p', { is: 'word-count' });
        descriptionInputElement.parentNode.appendChild(wordCountElement);
    }
});