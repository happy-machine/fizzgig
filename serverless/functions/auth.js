const connectToDatabase = require("../services/mongodb");
const jwt = require("jsonwebtoken");
const { register, login, generatePolicy } = require("../controllers/auth");

module.exports.login = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => login(JSON.parse(event.body)))
    .then((session) => ({
      statusCode: 200,
      body: JSON.stringify(session),
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: { stack: err.stack, message: err.message },
    }));
};

module.exports.register = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => {
      console.log("Registered with: ", JSON.parse(event.body));
      return register(JSON.parse(event.body));
    })
    .then((session) => ({
      statusCode: 200,
      body: JSON.stringify(session),
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message,
    }));
};

module.exports.auth = (event, context, callback) => {
  console.log({ event });
  // check header or url parameters or post parameters for token
  const token = event.authorizationToken.split("Bearer ")[1];
  if (!token) return callback(null, "Unauthorized");

  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return callback(null, "Unauthorized");

    // save to request for use in other routes
    return callback(null, generatePolicy(decoded.id, "Allow", event.methodArn));
  });
};
