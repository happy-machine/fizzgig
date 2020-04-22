const connectToDatabase = require("../services/mongodb");
const { getUser, updateUserTickers } = require("../controllers/userTickers");
const { headers } = require("../etc/lib");

module.exports.getUser = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Principal Id: ", event.requestContext.authorizer.principalId);
  return connectToDatabase()
    .then(() => getUser(event.requestContext.authorizer.principalId))
    .then((user) => ({
      statusCode: 200,
      body: JSON.stringify(user),
      headers,
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message }),
      headers,
    }));
};

module.exports.updateUserTickers = (event, context) => {
  console.log("CALLED!!", event.requestContext.authorizer.principalId);
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      updateUserTickers(
        event.requestContext.authorizer.principalId,
        JSON.parse(event.queryStringParameters.tickers)
      )
    )
    .then((user) => ({
      statusCode: 200,
      body: JSON.stringify(user),
      headers,
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message }),
      headers,
    }));
};
