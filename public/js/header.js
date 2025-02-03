class Header extends HTMLElement {
    constructor() {
        super();
        this.#render();
    }

    #render() {
        this.innerHTML = `
        <nav class="navbar">
          <section class="navbar-left">
            <a href="/" class="brand-name" style="text-decoration:none;">MonDomain</a>
          </section>
          <section class="navbar-right">
            <a href="/domains" class="domain-button" style="text-decoration:none;">Domain</a>
            <button class="mydomain-button">My Domains</button>
            <section class="cart-container" style="display: none; position: absolute; top: 50px; right: 0; border: 1px solid #ccc; background: white; padding: 1rem;">
              Сагс хоосон байна
            </section>
            <a href="/login" class="login-button" style="text-decoration:none;">Login</a>
          </section>
        </nav>
        `;

        // Toggle cart visibility when clicking the "My Domains" button
        this.querySelector(".mydomain-button").addEventListener("click", () => {
            const cart = this.querySelector(".cart-container");
            cart.style.display = cart.style.display === "none" ? "block" : "none";
        });
    }
}

customElements.define("my-header", Header);
