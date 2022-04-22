const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

const login = async () => {
  const credentials = {
    username: "billrdunn",
    password: "testPassword123",
  };

  const loginResponse = await api
    .post("/api/login")
    .send(credentials)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  return loginResponse.body.token;
};

describe("When there is initially one user in db", () => {
  beforeEach(async () => {
    const item0 = helper.initialItems[0];

    const passwordHash = await bcrypt.hash("testPassword123", 10);
    const user = new User({
      username: "billrdunn",
      name: "Bill Dunn",
      passwordHash,
      items: [item0],
    });

    await user.save();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "testUsername",
      name: "Test Name",
      password: "test-password",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "billrdunn",
      name: "Test Name",
      password: "test-password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username must be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("an item can be added to the user", async () => {
    const usersAtStart = await helper.usersInDb();
    const items1 = helper.initialItems[1];
    const user = usersAtStart[0];

    const newUser = {
      username: user.username,
      name: user.name,
      passwordHash: user.passwordHash,
      items: user.items.concat(items1),
    };

    const token = await login();

    await api
      .put(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    const userAfter = usersAtEnd.find((u) => u.id === user.id);
    expect(userAfter.items).toHaveLength(usersAtStart[0].items.length + 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
