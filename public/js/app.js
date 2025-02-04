import Domain from './domains.js';
import Data from "./data.js";
import Cart from "./cart.js";

const apiUrl = "https://api.jsonbin.io/v3/b/679fbb65e41b4d34e482e39e?meta=false";
const dataInstance = new Data(apiUrl);

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
    domainGrid.innerHTML = '';
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
    card.setAttribute("data-url", domain.url);
    
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

        const sortedWebsiteData = Array.from(dataInstance.domains.values());

        // Retrieve stored domains and cart items
        let storedDomains = JSON.parse(localStorage.getItem('savedDomains')) || [];
        let cartDomains = JSON.parse(localStorage.getItem('cart')) || [];

        // Ensure taken domains are correctly flagged
        storedDomains = storedDomains.map(d => {
            if (cartDomains.some(c => c.url === d.url)) {
                return { ...d, isTaken: true };
            }
            return d;
        });

        // Merge stored domains (priority over API if duplicate)
        const storedDomainsMap = new Map(storedDomains.map(d => [d.url, d]));
        const mergedDomains = sortedWebsiteData.map(d => storedDomainsMap.get(d.url) || d);

        // Sort all domains
        const allDomains = sortDomains(createDomainInstances([...mergedDomains, ...storedDomains]));

        populateGrid(allDomains);
        
        app.refreshCart();

        // Ensure taken domains get the red triangle UI on load
        setTimeout(() => {
            cartDomains.forEach(domain => {
                const domainCard = document.querySelector(`.domain-card[data-url="${domain.url}"]`);
                if (domainCard) {
                    domainCard.classList.add("taken");
                    const button = domainCard.querySelector(".add-to-cart");
                    if (button) button.disabled = true;
                }
            });
        }, 100); // Allow time for grid population

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
        const storedDomains = JSON.parse(localStorage.getItem('savedDomains')) || [];
        const apiDomains = Array.from(dataInstance.domains.values());

        // Merge stored domains with API data
        const storedDomainsMap = new Map(storedDomains.map(d => [d.url, d]));
        const mergedDomains = [
            ...apiDomains.map(d => storedDomainsMap.get(d.url) || d),
            ...storedDomains.filter(d => !apiDomains.some(apiDomain => apiDomain.url === d.url)) // Ensure stored domains not in API are included
        ];

        // Filter domains based on category or .mn ending
        const filteredData = mergedDomains.filter(domain => 
            domain.category === filterValue || domain.url.endsWith(filterValue)
        );

        const sortedData = sortDomains(filteredData);
        populateGrid(sortedData);

        // Handle no results case
        if (filteredData.length === 0) {
            domainGrid.innerHTML = '';
            const noResultsMessage = document.createElement('div');
            noResultsMessage.textContent = 'No matching domains found.';
            noResultsMessage.style.color = 'red';
            domainGrid.appendChild(noResultsMessage);
        }
    }

    function updateFilterUI(selectedItem) {
        // Remove underline from all items
        listItems.forEach(item => item.style.textDecoration = 'none');

        // Underline the selected item
        selectedItem.style.textDecoration = 'underline';

        // Update the URL with filter=
        const filterValue = selectedItem.innerHTML.trim();
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('filter', filterValue);
        history.replaceState(null, '', newUrl.toString());
    }

    // Add event listeners to filter items
    listItems.forEach((item) => {
        item.addEventListener('click', (event) => {
            updateGrid(event.currentTarget.innerHTML.trim());
            updateFilterUI(event.currentTarget);
        });
    });

    // Check if there's an existing filter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const filterValue = urlParams.get('filter');

    if (filterValue) {
        updateGrid(filterValue);

        // Underline the selected filter in the UI
        listItems.forEach(item => {
            if (item.innerHTML.trim() === filterValue) {
                item.style.textDecoration = 'underline';
            }
        });
    } else {
        // Load all domains if no filter is applied
        const storedDomains = JSON.parse(localStorage.getItem('savedDomains')) || [];
        const apiDomains = Array.from(dataInstance.domains.values());

        const storedDomainsMap = new Map(storedDomains.map(d => [d.url, d]));
        const mergedDomains = [
            ...apiDomains.map(d => storedDomainsMap.get(d.url) || d),
            ...storedDomains.filter(d => !apiDomains.some(apiDomain => apiDomain.url === d.url))
        ];
        const sortedData = sortDomains(createDomainInstances(mergedDomains));
        populateGrid(sortedData);
    }
});


document.querySelector('.search-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission

    const enteredDomain = domainInput.value.trim();

    if (!enteredDomain) {
        alert("Please enter a domain before searching.");
        return;
    }

    const storedDomains = JSON.parse(localStorage.getItem('savedDomains')) || [];
    const allDomains = [...Array.from(dataInstance.domains.values()), ...storedDomains];

    // Check if the domain already exists
    const existingDomain = allDomains.find(site => site.url === enteredDomain);

    if (existingDomain) {
        // alert(`Domain already exists: ${enteredDomain}`);
        populateGrid(allDomains);

        // Wait for DOM updates, then highlight the domain card
        setTimeout(() => {
            const domainCard = document.querySelector(`.domain-card[data-url="${enteredDomain}"]`);
            if (domainCard) {
                domainCard.scrollIntoView({ behavior: "smooth", block: "center" }); // Scroll to it
                domainCard.style.border = "2px solid red"; // Highlight
                setTimeout(() => domainCard.style.border = "", 2000); // Remove highlight after 2s
            }
        }, 100);
    } else {
        const domainExtension = enteredDomain.slice(enteredDomain.lastIndexOf('.'));

        // Validate the extension
        if (domainCosts.hasOwnProperty(domainExtension)) {
            const cost = domainCosts[domainExtension];

            document.getElementById('domain-cost').textContent = `${cost}₮`;

            // Show the popup for description and cost
            popup.style.display = 'flex';
        } else {
            alert("Invalid domain extension or domain not supported.");
        }
    }
});

// "Add Domain" button in the popup
document.getElementById('add-domain').addEventListener('click', () => {
    // Get the domain from the global variable
    const enteredDomain = window.selectedDomain ? window.selectedDomain.url : (domainInput.value? domainInput.value.trim(): null);
    const description = document.getElementById('description-input')? document.getElementById('description-input').value.trim(): window.selectedDescription;
    const selectedCategory = document.getElementById('category-dropdown') ? document.getElementById('category-dropdown').value: window.selectedCategory;
    
    if (!enteredDomain || !description || !selectedCategory) {
        alert("Error: no domain selected!");
        return;
    }

    let storedDomains = JSON.parse(localStorage.getItem('savedDomains')) || [];

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
    if (wordCount < 10) {
        alert("Your description must be at least 10 words long.");
        return;
    }

    // Show confirmation popup before adding to cart
    const confirmAdd = confirm(`Add domain "${enteredDomain}" to cart with category "${selectedCategory}"?`);
    if (!confirmAdd) return;

    // Create new domain entry
    const newDomainEntry = new Domain(enteredDomain, true, selectedCategory);

    // Save to localStorage
    storedDomains.push({ url: enteredDomain, isTaken: true, category: selectedCategory });
    localStorage.setItem('savedDomains', JSON.stringify(storedDomains));

    // Update domain map and re-render
    app.domains.set(enteredDomain, newDomainEntry);
    app.cart.addDomain(newDomainEntry);
    app.refreshCart();
    populateGrid([...Array.from(dataInstance.domains.values()), ...storedDomains]);

    console.log("New domain added, saved, and added to cart:", newDomainEntry);

    // Clear the global variable
    window.selectedDomain = null

    // Close the popup after adding the domain
    popup.style.display = 'none';
    document.getElementById('description-input').value = '';
    document.getElementById('category-dropdown').selectedIndex = 0;
});

// Close the popup
document.getElementById('close-popup').addEventListener('click', () => {
    popup.style.display = 'none';
});