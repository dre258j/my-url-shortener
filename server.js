const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let urlDatabase = {};
let counter = 1;

// Shorten URL logic
app.post('/shorten', (req, res) => {
    const { url } = req.body;
    const shortenedUrl = `https://${req.headers.host}/${counter}`;
    urlDatabase[counter] = url;
    counter++;
    res.json({ shortened_url: shortenedUrl });
});

// Redirect to original URL
app.get('/:id', (req, res) => {
    const id = req.params.id;
    const originalUrl = urlDatabase[id];
    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
