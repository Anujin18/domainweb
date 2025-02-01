import { websiteData } from '/public/js/example_domains.js'; // Import website data

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-button');
    const domainInput = document.querySelector('.domain-input');

    searchButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission

        const enteredDomain = domainInput.value.trim();

        if (!enteredDomain) {
            alert("Please enter a domain before searching.");
            return;
        }

        const existingDomain = websiteData.find(site => site.url === enteredDomain);
        console.log(existingDomain);
        if (existingDomain) {
            alert(`Domain already exists:`, existingDomain);
        } else {
            // Navigate to domains.html
            window.location.href = `/domains?param=${enteredDomain}`
            // domainInput.value = '';
        }
    });
});
