const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");

const app = express();
const itemsRouter = require("./controllers/items");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
// Check if the build dir contains a file corresponding to the request's address and if so, return it.
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
// The order of middlewares matters!

app.use("/api/items", itemsRouter);

// Use the middleware after the routes so it is
// only called if no route handles the request
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
