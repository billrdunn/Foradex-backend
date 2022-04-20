const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Item = require("../models/item");

const initialItems = [
  {
    _id: "625fc3035965f5afa2a08e06",
    latin: "Marasmius oreades",
    common: ["Fairy ring mushroom", "Fairy ring champignon"],
    __v: 0,
  },
  {
    _id: "625fc34d5965f5afa2a08e07",
    latin: "Lycoperdon utriformis",
    common: ["Mosaic puffball"],
    __v: 0,
  },
];

// Before each test, clear the database
beforeEach(async () => {
  await Item.deleteMany({});
  let itemObject = new Item(initialItems[0]);
  await itemObject.save();
  itemObject = new Item(initialItems[1]);
  await itemObject.save();
});

// api is a superagent object
const api = supertest(app);

test("items are returned as json", async () => {
  await api
    .get("/api/items")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all items are returned", async () => {
  const response = await api.get("/api/items");

  expect(response.body).toHaveLength(initialItems.length);
});

test("the second item is mosaic puffball", async () => {
  const response = await api.get("/api/items");

  expect(response.body[1].latin).toEqual("Lycoperdon utriformis");
});

test("the items contain Marasmius oreades", async () => {
  const response = await api.get("/api/items");

  // Create an array containing the latin name of every item returned by the API
  const contents = response.body.map((item) => item.latin);

  expect(contents).toContain("Marasmius oreades");
});

afterAll(() => {
  mongoose.connection.close();
});
