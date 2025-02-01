const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Serve static files correctly from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve index.html from the "view" folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// Add a route to serve domains.html (or any other HTML files you may need)
app.get('/domains', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'domains.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});