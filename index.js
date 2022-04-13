// Environment variables from .env file now available globally
require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Item = require("./models/item");
const { redirect } = require("express/lib/response");

app.use(cors());
app.use(morgan("tiny"));

// Check if the build dir contains a
// file corresponding to the request's address
// and if so, return it.
app.use(express.static("build"));

app.get("/api/items", (req, res) => {
  Item.find({}).then((items) => {
    // Send as a json fomatted string
    res.json(items);
  });
});

app.get("/api/items/:id", (req, res) => {
  Item.findById(req.params.id)
    .then((item) => {
      item ? res.json(item) : res.status(404).end();
    })
    .catch((error) => {
      console.log(error);
      // Status 400 means request should not be repeated without modifications
      res.status(400).send({ error: "malformatted id" });
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Use the middleware after the routes so it is
// only called if no route handles the request
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT + "/");
});
