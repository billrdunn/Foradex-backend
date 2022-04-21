const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const Item = require("../models/item");



// Before each test, clear the database
beforeEach(async () => {
  await Item.deleteMany({});

  let itemObject = new Item(helper.initialItems[0]);
  await itemObject.save();
  
  itemObject = new Item(helper.initialItems[1]);
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
  expect(response.body).toHaveLength(helper.initialItems.length);
});

test("the second item is mosaic puffball", async () => {
  const response = await api.get("/api/items");
  expect(response.body[1].latin).toEqual("Lycoperdon utriformis");
});

test("the items contain Marasmius oreades", async () => {
  const response = await api.get("/api/items");

  // Create an array containing the latin name of every item returned by the API
  const latinNames = response.body.map((item) => item.latin);

  expect(latinNames).toContain("Marasmius oreades");
});

test("a GET request with the appropriate id returns the corresponding item", async () => {
  const response = await api.get("/api/items/625fc34d5965f5afa2a08e07");

  expect(response.body.latin).toEqual(helper.initialItems[1].latin);
});

test("a GET request to an unknown item responds with status 404 ", async () => {
  await api.get("/api/items/525fc34d5965f5afa2a08e07").expect(404);
});

afterAll(() => {
  mongoose.connection.close();
});
