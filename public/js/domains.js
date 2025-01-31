import { websiteData } from '/public/js/example_domains.js'; // Import website data

// Create a Map to store the searched domains
const searchedDomains = new Map();

// Function to retrieve query parameters from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to create a new domain card for the carousel
function createDomainCard(domain) {
    const card = document.createElement('div');
    card.classList.add('carousel-card');
    
    // Create the content for the card
    card.innerHTML = `
        <a href="https://${domain.url}" target="_blank">${domain.url}</a>
        <div class="category">${domain.category}</div>
        <div class="status">${domain.isTaken ? 'Taken' : 'Available'}</div>
    `;
    
    return card;
}

// Auto-scroll logic
let scrollInterval;
const carousel = document.querySelector('.carousel');

function startAutoScroll() {
    const cardWidth = document.querySelector('.carousel-card').offsetWidth + 15; // Card width + gap
    scrollInterval = setInterval(() => {
        // Scroll the carousel by one card width
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
            // If we've reached the end, reset scroll position to the start
            carousel.scrollLeft = 0;
        } else {
            carousel.scrollLeft += cardWidth;
        }
    }, 3000); // Scroll every 3 seconds (adjustable)
}

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-button');
    const domainInput = document.querySelector('.domain-input');

    const popup = document.getElementById('popup');
    const closePopupButton = document.getElementById('close-popup');
    const descriptionInput = document.getElementById('description-input');
    const addDomainButton = document.getElementById('add-domain');
    const domainCostElement = document.getElementById('domain-cost');

    // Mapping domain extensions to costs
    const domainCosts = {
        '.mn': 286000,
        '.io': 110000,
        '.biz': 121000,
        '.info': 176000,
        '.asia': 110000,
        '.cc': 110000,
        '.mobi': 242000,
        '.name': 110000,
        '.tv': 220000,
        '.мон': 55000
    };

    // Get the parameter 'param' from the URL and display it
    const paramValue = getQueryParameter("param");
    if (paramValue != null) {
        domainInput.value = `${paramValue}`;
    }

    // Populate the carousel with existing domains from websiteData
    websiteData.forEach(domain => {
        const domainCard = createDomainCard(domain);
        carousel.appendChild(domainCard);
    });

    // Start the auto-scroll when the page is loaded
    startAutoScroll();

    // Handle search button click
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
            const domainExtension = enteredDomain.slice(enteredDomain.lastIndexOf('.'));

            // Validate if the extension is valid
            if (domainCosts[domainExtension]) {
                const cost = domainCosts[domainExtension];
                domainCostElement.textContent = `${cost}₮`;

                // Show the popup for description and cost
                popup.style.display = 'flex';
            } else {
                console.warn("Invalid domain extension or domain not supported.");
            }
            // const newDomainEntry = {
            //     url: enteredDomain,
            //     isTaken: false,
            //     category: "Unknown"
            // };

            // // Add the new domain to the map and log it
            // searchedDomains.set(enteredDomain, newDomainEntry);
            // console.log("New domain added:", newDomainEntry);

            // // Create and append the new domain card to the carousel
            // const newCard = createDomainCard(newDomainEntry);
            // carousel.appendChild(newCard);

            // Optionally clear the input field
            // domainInput.value = '';
        }
    });

    // Handle the "Add Domain" button click in the popup
    addDomainButton.addEventListener('click', () => {
        const description = descriptionInput.value.trim();
    
        if (!description) {
        alert("Description is required!");
        return;
        }
    
        console.log("Domain added with description:", description);
    
        // Close the popup after adding the domain
        popup.style.display = 'none';
        descriptionInput.value = ''; // Clear the description input
    });
    
    // Close the popup
    closePopupButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
});