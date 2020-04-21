const { expect, should, assert } = require("chai");
const { fetchTickerValues } = require("../controllers/ticker");
const { mockUser1 } = require("./mocks");

describe("ticker-controller", () => {
  describe("fetchTickerValues", () => {
    it.only("Should return a list of symbols for the user", () => {
      const results = fetchTickerValues(mockUser1);
      expect(results).to.be.an("array");
      expect(results).to.include.members(["IBM", "TES2"]);
    });
  });
});
