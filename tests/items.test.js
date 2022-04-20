const itemsHelper = require("../utils/items_helper");

describe("example describe block", () => {
  const dummyItemList = [
    {
      _id: "625fc3035965f5afa2a08e06",
      latin: "Marasmius oreades",
      common: ["Fairy ring mushroom", "Fairy ring champignon"],
      __v: 0,
    },
    {
      _id: "mdn784rhldj5n99039mk4mk3",
      latin: "Lycoperdon utriformis",
      common: ["Mosaic puffball"],
      __v: 0,
    },
  ];

  test("first item is fairy ring champignon", () => {
    const result = itemsHelper.firstItem(dummyItemList);
    expect(result).toEqual(dummyItemList[0]);
  });
});
