const connectToDatabase = require("../services/mongodb");
const { getUser } = require("../controllers/userTickers");

module.exports.getUser = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Principal Id: ", event.requestContext.authorizer.principalId);
  return connectToDatabase()
    .then(() => getUser(event.requestContext.authorizer.principalId))
    .then((user) => ({
      statusCode: 200,
      body: JSON.stringify(user),
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ message: err.message }),
    }));
};
