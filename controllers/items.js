const itemRouter = require("express").Router();
const Item = require("../models/item");

itemRouter.get("/", (req, res) => {
  Item.find({}).then((items) => {
    // Send as a json fomatted string
    res.json(items);
  });
});

itemRouter.get("/:id", (req, res, next) => {
  Item.findById(req.params.id)
    .then((item) => {
      if (item) res.json(item);
      else res.status(404).end();
    })
    .catch((err) => next(err));
});

module.exports = itemRouter;
