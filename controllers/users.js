const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

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
  const user = await User.findById(request.params.id);
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
