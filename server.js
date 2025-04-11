const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let urlDatabase = {};

app.post("/shorten", (req, res) => {
  const { url, custom } = req.body;
  let shortPath;

  if (custom) {
    if (urlDatabase[custom]) {
      return res.json({ error: "Custom word already in use!" });
    }
    shortPath = custom;
  } else {
    // Auto-generate number
    shortPath = Date.now().toString(36);
    while (urlDatabase[shortPath]) {
      shortPath = Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
    }
  }

  urlDatabase[shortPath] = url;
  const shortenedUrl = `https://${req.headers.host}/${shortPath}`;
  res.json({ shortened_url: shortenedUrl });
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  const originalUrl = urlDatabase[id];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send("URL not found");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

module.exports = app;
