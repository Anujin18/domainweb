export let count = 0;

export default class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    // Render cart contents
    render() {
        if (this.cart.length === 0) {
            return `<p>Сагс хоосон байна</p>`;
        }

        let cartHTML = "";
        this.cart.forEach(domain => {
            cartHTML += `<div style="width:40ch; display:flex; justify-content:space-between;">
                <div>${domain.url}</div>
                <div>${domain.category}</div>
            </div>`;
        });

        return cartHTML;
    }

    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        app.refreshCart();
    }

    // Add a domain to the cart
    addDomain(domain) {
        if (!this.cart.some(d => d.url === domain.url)) {
            const confirmAdd = confirm(`Are you sure you want to add "${domain.url}" to the cart?`);
            if (!confirmAdd) return;

            this.cart.push(domain);
            domain.isTaken = true; // Mark domain as taken
            
            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(this.cart));

            // Also update saved domains (to persist taken state)
            let storedDomains = JSON.parse(localStorage.getItem('savedDomains')) || [];
            storedDomains = storedDomains.map(d => d.url === domain.url ? { ...d, isTaken: true } : d);
            localStorage.setItem('savedDomains', JSON.stringify(storedDomains));

            count++;

            // Update UI: Add taken class and disable button
            const domainCard = document.querySelector(`.domain-card[data-url="${domain.url}"]`);
            if (domainCard) {
                domainCard.classList.add("taken");
                domainCard.querySelector(".add-to-cart").disabled = true;
            }

            // Refresh cart UI
            app.refreshCart();

            console.log("Domain successfully added to cart:", domain);
        }
    }
}
