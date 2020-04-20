const { expect, should, assert } = require("chai");
const { getTickerValues } = require("../controllers/ticker");
const { mockUser1 } = require("./mocks");

describe("ticker-controller", () => {
  describe("getTickerValues", () => {
    it.only("Should return a list of symbols for the user", () => {
      const results = getTickerValues(mockUser1);
      expect(results).to.be.an("array");
      expect(results).to.include.members(["IBM", "TES2"]);
    });
  });
});
