document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-button');
    const domainInput = document.querySelector('.domain-input');
    
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

    searchButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission

        const enteredDomain = domainInput.value.trim();

        if (!enteredDomain) {
            alert("Please enter a domain before searching.");
            return;
        }

        
        const domainExtension = enteredDomain.slice(enteredDomain.lastIndexOf('.'));

        // Validate if the extension is valid
        if (domainCosts[domainExtension]) {
            window.location.href = `/domains?param=${enteredDomain}`
        } else {
            alert("Invalid domain extension or domain not supported.");
        }
    });
});
