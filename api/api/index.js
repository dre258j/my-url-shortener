const express = require("express");
const app = express();

app.use(express.json());
let urlDatabase = {};
let counter = 1;

app.post("/shorten", (req, res) => {
  const { url } = req.body;
  const shortPath = counter.toString();
  urlDatabase[shortPath] = url;
  counter++;
  res.json({ shortened_url: `https://${req.headers.host}/${shortPath}` });
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

module.exports = app;
