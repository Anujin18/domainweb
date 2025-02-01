class Header extends HTMLElement {
    constructor() {
        super();
        this.#render();
    }
    #render(){
        this.innerHTML = `
        <nav class="navbar">
          <section class="navbar-left">
            <a href="/" class="brand-name" style="text-decoration:none;">MonDomain</a>
          </section>
          <section class="navbar-right">
            <a href="/domains" class="domain-button" style="text-decoration:none;">Domain</a>
            <a href="/mydomain" class="mydomain-button" style="text-decoration:none;">My Domain</a>
            <a href="/login" class="login-button" style="text-decoration:none;">Login</a>
          </section>
        </nav>
        `
    }
} 

customElements.define("my-header", Header);