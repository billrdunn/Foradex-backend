const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

// api is a superagent object
const api = supertest(app);

test("items are returned as json", async () => {
  await api
    .get("/api/items")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two items", async () => {
  const response = await api.get("/api/items");

  expect(response.body).toHaveLength(2);
});

test("the second item is mosaic puffball", async () => {
  const response = await api.get("/api/items");

  expect(response.body[1].latin).toEqual("Lycoperdon utriformis");
});

afterAll(() => {
  mongoose.connection.close();
});
