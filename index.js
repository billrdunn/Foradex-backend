const express = require("express");
const app = express();

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/items", (req, res) => {
  res.json(items);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT + "/");
});
