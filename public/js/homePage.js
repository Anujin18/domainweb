import { websiteData } from '/public/js/data.js'; // Import website data

// Create a Map to store the searched domains
const searchedDomains = new Map();

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-button');
    const domainInput = document.querySelector('.domain-input');

    searchButton.addEventListener('click', () => {
        const enteredDomain = domainInput.value.trim();

        if (!enteredDomain) {
            console.warn("Please enter a domain before searching.");
            return;
        }

        const existingDomain = websiteData.find(site => site.url === enteredDomain);

        if (existingDomain) {
            console.log(`Domain already exists:`, existingDomain);
        } else {
            const newDomainEntry = {
                url: enteredDomain,
                isTaken: false,
                category: "Unknown"
            };

            searchedDomains.set(enteredDomain, newDomainEntry);
            console.log("New domain added:", newDomainEntry);
        }

        domainInput.value = '';
    });
});
