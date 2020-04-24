const User = require("../models/User");
const bcrypt = require("bcryptjs-then");
const jwt = require("jsonwebtoken");

function signToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: 86400, // 24 hours
  });
}

function checkIfInputIsValid(eventBody) {
  if (!(eventBody.password && eventBody.password.length >= 7)) {
    return Promise.reject(
      new Error(
        "Password error. Password needs to be longer than 8 characters."
      )
    );
  }

  if (
    !(
      eventBody.name &&
      eventBody.name.length > 5 &&
      typeof eventBody.name === "string"
    )
  )
    return Promise.reject(
      new Error("Username error. Username needs to longer than 5 characters")
    );

  if (!(eventBody.email && typeof eventBody.email === "string"))
    return Promise.reject(
      new Error("Email error. Email must have valid characters.")
    );

  return Promise.resolve();
}

function register(eventBody, id) {
  return checkIfInputIsValid(eventBody)
    .then(() => User.findOne({ email: eventBody.email }))
    .then((user) =>
      user
        ? Promise.reject(new Error("User with that email exists."))
        : bcrypt.hash(eventBody.password, 8)
    )
    .then((hash) =>
      User.create({
        name: eventBody.name,
        email: eventBody.email,
        password: hash,
      })
    )
    .then((user) => ({ auth: true, token: signToken(user._id) }));
}

function login(eventBody) {
  return User.findOne({ email: eventBody.email })
    .then((user) =>
      !user
        ? Promise.reject(new Error("User with that email does not exist."))
        : comparePassword(eventBody.password, user.password, user._id)
    )
    .then((token) => ({ auth: true, token: token }));
}

function comparePassword(eventPassword, userPassword, userId) {
  return bcrypt
    .compare(eventPassword, userPassword)
    .then((passwordIsValid) =>
      !passwordIsValid
        ? Promise.reject(new Error("The credentials do not match."))
        : signToken(userId)
    );
}

const generatePolicy = (principalId, effect, resource) => {
  // Policy helper function
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports = {
  signToken,
  checkIfInputIsValid,
  register,
  login,
  comparePassword,
  generatePolicy,
};
