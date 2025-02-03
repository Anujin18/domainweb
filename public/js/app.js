import Domain from './domains.js';
import Data from "./data.js";
import Cart from "./cart.js";

const apiUrl = "https://api.jsonbin.io/v3/b/679fbb65e41b4d34e482e39e?meta=false";
const dataInstance = new Data(apiUrl);

// const searchedDomains = new Map();
const domainGrid = document.querySelector('.domain-grid');
const domainInput = document.querySelector('.domain-input');
const cartContainer = document.querySelector("cart-container");

const cart = new Cart();
const app = { cart, domains: new Map() };

// Expose app globally
window.app = app;

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

// Declare storedDomains globally
let storedDomains = JSON.parse(localStorage.getItem('savedDomains')) || [];

// Function to create domain instances and populate `app.domains`
function createDomainInstances(domains) {
    const domainInstances = domains.map(domain => new Domain(domain.url, domain.isTaken, domain.category));
    
    // Populate `app.domains` map
    domainInstances.forEach(domain => app.domains.set(domain.url, domain));

    return domainInstances;
}

function populateGrid(domains) {
    domainGrid.innerHTML = ''; // Clear the grid before populating
    domains.forEach(domain => {
        const domainCard = createDomainCard(domain);
        domainGrid.appendChild(domainCard);
    });
}

function sortDomains(domains) {
    return domains.sort((a, b) => a.url.localeCompare(b.url)); // alphabetical
}

function createDomainCard(domain) {
    const card = document.createElement('div');
    card.classList.add('domain-card');
    
    // If the domain is taken, add the red triangle
    if (domain.isTaken) {
        card.classList.add('taken');
    }

    card.innerHTML = `
        <a target="_blank">${domain.url}</a>
        <div class="category">${domain.category}</div>
        <button class="add-to-cart" ${domain.isTaken ? "disabled" : ""} 
            onclick="app.cart.addDomain(app.domains.get('${domain.url}')); app.refreshCart();">
            🛒 Add to Cart
        </button>
    `;
    
    return card;
}

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Refresh cart UI
app.refreshCart = () => {
    const cartContainer = document.querySelector(".cart-container"); // Re-select it to avoid null errors
    if (!cartContainer) {
        console.error("Error: Cart container not found in the DOM.");
        return;
    }
    cartContainer.innerHTML = cart.render();
};

// Event listener: Fetch data and populate the grid on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await dataInstance.fetchData();

        // Convert Map values to an array and extract domains
        const sortedWebsiteData = sortDomains(Array.from(dataInstance.domains.values()));

        // Sort and merge stored domains
        const sortedStoredDomains = sortDomains(storedDomains);

        // Convert to instances and populate `app.domains`
        const allDomains = createDomainInstances([...sortedWebsiteData, ...sortedStoredDomains]);

        populateGrid(allDomains);

        // Get the parameter 'param' from the URL and display it
        const paramValue = getQueryParameter("param");
        if (paramValue != null) {
            domainInput.value = `${paramValue}`;
        }
    } catch (error) {
        console.error("Failed to fetch website data:", error);
    }
});

// Filter
window.addEventListener('load', () => {
    const listItems = document.querySelectorAll('.filter li.target-item');
    
    function updateGrid(filterValue) {
        const filteredData = dataInstance.websiteData.filter(domain => 
            domain.category === filterValue || domain.url.endsWith(filterValue)
        );

        const sortedData = sortDomains(filteredData);
        populateGrid(sortedData);

        if (filteredData.length === 0) {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.textContent = 'No matching domains found.';
            noResultsMessage.style.color = 'red';
            domainGrid.appendChild(noResultsMessage);
        }
    }

    listItems.forEach((item) => {
        item.addEventListener('click', (event) => {
            const filterValue = event.currentTarget.innerHTML.trim();
            updateGrid(filterValue);
        });
    });

    const sortedData = sortDomains(dataInstance.websiteData);
    populateGrid(sortedData);
});


document.querySelector('.search-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission
    
    const enteredDomain = domainInput.value.trim();
    
    if (!enteredDomain) {
        alert("Please enter a domain before searching.");
        return;
    }

    const existingDomain = dataInstance.websiteData.find(site => site.url === enteredDomain);

    if (existingDomain) {
        alert(`Domain already exists:`, existingDomain);
    } else {
        const domainExtension = enteredDomain.slice(enteredDomain.lastIndexOf('.'));

        // Validate if the extension is valid
        if (domainCosts[domainExtension]) {
            const cost = domainCosts[domainExtension];
            
            document.getElementById('domain-cost').textContent = `${cost}₮`;

            // Show the popup for description and cost
            popup.style.display = 'flex';
        } else {
            alert("Invalid domain extension or domain not supported.");
        }
    }
});

// Handle the "Add Domain" button click in the popup
document.getElementById('add-domain').addEventListener('click', () => {
    const description = document.getElementById('description-input').value.trim();
    const selectedCategory = document.getElementById('category-dropdown').value;
    const enteredDomain = domainInput.value.trim();

    // Check if the entered domain is already in localStorage or taken
    const existingDomain = storedDomains.find(domain => domain.url === enteredDomain);

    if (existingDomain) {
        alert(`Domain already exists and is taken: ${enteredDomain}`);
        return; // Don't add the domain if it already exists
    }

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
        isTaken: true,
        category: selectedCategory
    };

    // Save to localStorage
    storedDomains.push(newDomainEntry);
    localStorage.setItem('savedDomains', JSON.stringify(storedDomains));

    populateGrid([...dataInstance.websiteData, newDomainEntry]);

    console.log("New domain added and saved:", newDomainEntry);

    // Close the popup after adding the domain
    popup.style.display = 'none';
    document.getElementById('description-input').value = '';
    document.getElementById('category-dropdown').selectedIndex = 0;

    // Clear URL param and refresh the page
    // const url = new URL(window.location);
    // url.searchParams.delete("param");
    // window.history.replaceState({}, document.title, url); // Update URL without param
    // location.reload(); // Refresh page
});

// Close the popup
document.getElementById('close-popup').addEventListener('click', () => {
    popup.style.display = 'none';
});