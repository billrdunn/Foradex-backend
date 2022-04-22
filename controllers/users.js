const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // TODO: implement other validations on user creation
  // eg. length of username & password, permitted characters

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).send({ error: "username must be unique" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
  return null;
});

usersRouter.get("/", async (request, response) => {
  // Populate replaces the _id with the object
  // Can also use a second argument to limit the properties of the object
  // Populate depends on defining a "type" in the Mongoose schema using "ref"
  const users = await User.find({}).populate("items");
  response.json(users);
});

usersRouter.put("/:id", async (request, response) => {
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(404).send({ error: "user not found" });
  }

  const { username, name, passwordHash, items } = request.body;

  if (username) user.username = username;
  if (name) user.name = name;
  if (passwordHash) user.passwordHash = passwordHash;
  if (items) user.items = items;

  const updatedUser = await user.save();
  response.json(updatedUser);
  return null;
});

module.exports = usersRouter;
