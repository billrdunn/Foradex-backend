const express = require("express");
const app = express();
const morgan = require("morgan");

let items = [
  {
    latin: "Amanita muscara",
    common: ["Fly agaric"],
    id: 0,
  },
  {
    latin: "Scleroderma citrinum",
    common: ["Common earthball"],
    id: 1,
  },
  {
    latin: "Amanita virosa",
    common: ["Destroying angel"],
    id: 2,
  },
];

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/items", (req, res) => {
  // Send as a json fomatted string
  res.json(items);
});

app.get("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = items.find((item) => item.id === id);
  item ? res.json(item) : res.status(404).end();
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  items = items.filter((item) => item.id !== id);
  res.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

// Use the middleware after the routes so it is
// only called if no route handles the request
app.use(unknownEndpoint)

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT + "/");
});
