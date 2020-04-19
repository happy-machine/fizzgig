const { expect, should, assert } = require("chai");
const bcrypt = require("bcryptjs-then");
const { checkIfInputIsValid, comparePassword } = require("../controllers/auth");
const {
  mockauthBody,
  mockBadAuthBody,
  mockBadAuthBody2,
  mockBadAuthBody3,
} = require("./mocks");

// remember to source etc/.test-env to set mock variables for the test!

describe("auth-controller", () => {
  describe("checkIfInputIsValid", () => {
    it("Should reject and throw an error if password is shorter than 7 characters", () => {
      checkIfInputIsValid(mockBadAuthBody).then(
        () => Promise.reject(new Error("Expected method to reject.")),
        (e) => assert.instanceOf(e, Error)
      );
    });
    it("Should reject and throw an error if there is no name", () => {
      checkIfInputIsValid(mockBadAuthBody2).then(
        () => Promise.reject(new Error("Expected method to reject.")),
        (e) => assert.instanceOf(e, Error)
      );
    });
    it("Should reject and throw an error if the email is not a string", () => {
      checkIfInputIsValid(mockBadAuthBody3).then(
        () => Promise.reject(new Error("Expected method to reject.")),
        (e) => assert.instanceOf(e, Error)
      );
    });
    it("Should not reject and throw not throw an error with valid credentials", () => {
      checkIfInputIsValid(mockauthBody)
        .then((result) => should.equal(result, undefined))
        .catch((e) => e);
    });
  });
  describe("comparePassword", () => {
    it("Should reject and throw an error if passwords do not match", () => {
      comparePassword(
        "test£242428password",
        "test£242428password",
        "test-id"
      ).then(
        () => Promise.reject(new Error("Expected method to reject.")),
        (result) => assert.instanceOf(result, Error)
      );
    });
    it("Should return the id if passwords match", () => {
      bcrypt
        .hash("test£242428password", 8)
        .then((result) => result)
        .then((result) =>
          comparePassword("test£242428password", result, "test-id")
        )
        .then((e) => expect(e).to.be.a("string"));
    });
  });
});
