import { websiteData } from '/public/js/example_domains.js'; // Import website data

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

            console.log("New domain added:", newDomainEntry);
            
            // Navigate to domains.html
            window.location.href = `/domains?param=${newDomainEntry.url}`
            // domainInput.value = '';
        }
    });
});
