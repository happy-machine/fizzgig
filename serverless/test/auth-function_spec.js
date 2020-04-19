const { expect, should, assert } = require("chai");
const { auth } = require("../functions/auth");
const { mockAuthEvent, mockBadAuthEvent } = require("./mocks");

// remember to source etc/.test-env to set mock variables for the test!

describe("auth-function", () => {
  describe("auth", () => {
    it("Given a valid token the auth function should return a pricipalId", () => {
      const results = auth(mockAuthEvent, null, (_, result) => result);
      console.log({ results });
      expect(results).to.be.have.property("principalId");
    });

    it("Given an invalid token the auth function should return unAuthorized", () => {
      const results = auth(mockBadAuthEvent, null, (_, result) => result);
      console.log({ results });
      expect(results).to.equal("Unauthorized");
    });
  });
});
