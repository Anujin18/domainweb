export default class Domain {
    constructor(url, isTaken, category) {
        this.url = url;
        this.isTaken = isTaken;
        this.category = category;
    }

    render() {
        return `
        <div class="domain-card ${this.isTaken ? 'taken' : ''}">
            <a href="https://${this.url}" target="_blank">${this.url}</a>
            <div class="category">${this.category}</div>
            <button onclick="app.cart.addDomain(app.domains.get('${this.url}')); app.refreshCart();" ${this.isTaken ? "disabled" : ""}>
                🛒
            </button>
        </div>`;
    }
}
