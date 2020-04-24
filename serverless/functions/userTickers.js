const connectToDatabase = require("../services/mongodb");
const { getUser, updateUserTickers } = require("../controllers/userTickers");
const { headers } = require("../etc/lib");

module.exports.getUser = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
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
  context.callbackWaitsForEmptyEventLoop = false;
  const { tickers, id } = JSON.parse(event.body);
  return connectToDatabase()
    .then(() => updateUserTickers(id, tickers))
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
