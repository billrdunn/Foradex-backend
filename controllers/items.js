const itemRouter = require("express").Router();
const Item = require("../models/item");

itemRouter.get("/", async (req, res) => {
  const items = await Item.find({});
  // Send as a json fomatted string
  res.json(items);
});

itemRouter.get("/:id", async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (item) res.json(item);
  else res.status(404).end();

  // what about catch?
  
  // Item.findById(req.params.id)
  //   .then((item) => {
  //     if (item) res.json(item);
  //     else res.status(404).end();
  //   })
  //   .catch((err) => next(err));
});

module.exports = itemRouter;
