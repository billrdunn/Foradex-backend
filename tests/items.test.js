const itemsHelper = require("../utils/items_helper");

describe("example describe block", () => {
  const dummyItemList = [
    {
      _id: "mdn784rhldj5n99039mk4dp2",
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
