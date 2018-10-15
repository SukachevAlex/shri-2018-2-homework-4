const express = require('express');
const app = express();
const port = 8000;

app.all('*', (req, res) => {
    res.status(404).send('<h1>Page not found</h1>');
});

app.listen(port, () => console.log(`Working on port ${port}`));