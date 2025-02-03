export let count = 0;

export default class Cart {
    constructor() {
        this.cart = [];
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

    // Add a domain to the cart
    addDomain(domain) {
        if (!domain) {
            console.error("Error: Trying to add an undefined domain to cart.");
            return;
        }

        if (!this.cart.some(d => d.url === domain.url)) {
            this.cart.push(domain);
            domain.isTaken = true; // Mark domain as taken
            count++;
        }
    }
}
