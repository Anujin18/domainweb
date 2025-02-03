export default class Data {
    constructor(apiUrl) {
        this.url = apiUrl;
        this.domains = [];
    }

    // Fetch data from JSONBin.io or API
    async fetchData() {
        try {
            const response = await fetch(this.url, {
                headers: {
                    "X-Master-Key": "$2a$10$gykCRmKE7En1QFoVep4yv.d4XCnaCZBEfIU4WnwP0rH53AOwumK5u"
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const responseData = await response.json();

            // Extract websiteData array
            const websiteData = responseData.websiteData || [];

            // Sort alphabetically by URL
            this.domains = websiteData.sort((a, b) => a.url.localeCompare(b.url));
            return new Map(this.domains.map(domain => [domain.url, domain]));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
