const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// In-memory database for shortened URLs
let urlDatabase = {};
let counter = 1;

// Shorten URL logic
app.post('/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  const shortenedUrl = `https://${req.headers.host}/${counter}`;
  urlDatabase[counter] = url;
  counter++;
  res.send(`<p>Shortened URL: <a href="${shortenedUrl}" target="_blank">${shortenedUrl}</a></p>`);
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

module.exports = app; // ✅ Important for Vercel
