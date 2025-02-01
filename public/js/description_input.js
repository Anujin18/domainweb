// Create a class for the custom WordCount element
class WordCount extends HTMLParagraphElement {
    constructor() {
        super();
    
        // Find the input field next to this word count element
        const inputField = document.getElementById('description-input');

        // Function to count words
        function countWords(text) {
            return text.trim().split(/\s+/g).filter(a => a.trim().length > 0).length;
        }

        // Create shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // Create text node to show word count
        const text = document.createElement('span');
        text.textContent = `Words: 0`;
        text.style.color = 'black';

        // Append it to shadow root
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
  
// Define the custom element
customElements.define('word-count', WordCount, { extends: 'p' });
  
// Ensure the description input exists before appending word count
document.addEventListener('DOMContentLoaded', () => {
    const descriptionInputElement = document.getElementById('description-input');
    if (descriptionInputElement) {
        const wordCountElement = document.createElement('p', { is: 'word-count' });
        descriptionInputElement.parentNode.appendChild(wordCountElement);
    }
});