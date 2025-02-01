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
    const searchButton = document.querySelector('.search-actions');
    const domainInput = document.querySelector('.domain-input');

    const popup = document.getElementById('popup');
    const closePopupButton = document.getElementById('close-popup');
    const categoryDropdown = document.getElementById('category-dropdown');
    const descriptionInput = document.getElementById('description-input');
    const addDomainButton = document.getElementById('add-domain');
    const domainCostElement = document.getElementById('domain-cost');
    
    // Local storage
    const storedDomains = JSON.parse(localStorage.getItem('savedDomains')) || [];
    
    // Function to retrieve query parameters from the URL
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Populate the carousel with saved domains from localStorage
    function loadSavedDomains() {
        storedDomains.forEach(domain => {
            const domainCard = createDomainCard(domain);
            carousel.appendChild(domainCard);
        });
    }

    loadSavedDomains(); // Load stored domains on page load

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
    searchButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission

        const enteredDomain = domainInput.value.trim();
        
        if (!enteredDomain) {
            alert("Please enter a domain before searching.");
            return;
        }

        const existingDomain = websiteData.find(site => site.url === enteredDomain);

        if (existingDomain) {
            alert(`Domain already exists:`, existingDomain);
        } else {
            const domainExtension = enteredDomain.slice(enteredDomain.lastIndexOf('.'));

            // Validate if the extension is valid
            if (domainCosts[domainExtension]) {
                const cost = domainCosts[domainExtension];
                
                domainCostElement.textContent = `${cost}₮`;

                // Show the popup for description and cost
                popup.style.display = 'flex';
            } else {
                alert("Invalid domain extension or domain not supported.");
            }
        }
    });

    // Handle the "Add Domain" button click in the popup
    addDomainButton.addEventListener('click', () => {
        const description = descriptionInput.value.trim();
        const selectedCategory = categoryDropdown.value;
        const enteredDomain = domainInput.value.trim();

        // Function to count words again in the end
        function countWords(text) {
            return text.trim().split(/\s+/g).filter(a => a.trim().length > 0).length;
        }

        const wordCount = countWords(description);

        if (!selectedCategory) {
            alert("Please select a category before adding the domain.");
            return;
        }
        if (!description) {
            alert("Description is required!");
            return;
        } 
        else if (wordCount < 10) {
            alert("Your description must be at least 10 words long.");
            return;
        }

        // Create new domain entry
        const newDomainEntry = {
            url: enteredDomain,
            isTaken: true, // Set as taken
            category: selectedCategory // Assign chosen category
        };

        // Save to localStorage
        storedDomains.push(newDomainEntry);
        localStorage.setItem('savedDomains', JSON.stringify(storedDomains));

        console.log("New domain added and saved:", newDomainEntry);

        // Close the popup after adding the domain
        popup.style.display = 'none';
        descriptionInput.value = ''; // Clear the description input
        categoryDropdown.selectedIndex = 0; // Reset dropdown

        // Clear URL param and refresh the page
        const url = new URL(window.location);
        url.searchParams.delete("param");
        window.history.replaceState({}, document.title, url); // Update URL without param
        location.reload(); // Refresh page
    });
    
    // Close the popup
    closePopupButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
});