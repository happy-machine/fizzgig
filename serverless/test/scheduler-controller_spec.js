const { expect, should, assert } = require("chai");
const { shouldNotify } = require("../controllers/scheduler");
const {
  mockTicker1,
  mockTicker2,
  mockUser1,
  mockUser2,
  mockUser3,
  mockUser4,
} = require("./mocks");

// remember to source etc/.test-env to set mock variables for the test!

describe("scheduler-controller", () => {
  describe("shouldNotify", () => {
    it("Should return false if value of stock is within thresholds", () => {
      const results = shouldNotify(mockUser1.tickers[0], mockTicker1);
      expect(results).to.be.false;
    });
    it("Should return true if value of stock is beyond a threshold and notified outside of time limit", () => {
      const results = shouldNotify(mockUser1.tickers[0], mockTicker2);
      expect(results).to.be.true;
    });
    it("Should return false if value of stock is beyond a threshold and notified outside of time limit but should_notify is false", () => {
      const results = shouldNotify(mockUser3.tickers[0], mockTicker2);
      expect(results).to.be.false;
    });
    it("Should return false if value of stock is beyond thresholds and notified inside time limit", () => {
      const results = shouldNotify(mockUser2.tickers[0], mockTicker2);
      expect(results).to.be.false;
    });
    it.only("Should return true with floats", () => {
      const results = shouldNotify(mockUser4.tickers[0], mockTicker1);
      expect(results).to.be.true;
    });
  });
});
