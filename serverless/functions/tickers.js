const connectToDatabase = require("../services/mongodb");
const { fetchTickers } = require("../controllers/tickers");
const { headers } = require("../etc/lib");

module.exports.fetchTickers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => fetchTickers(event.requestContext.authorizer.principalId))
    .then((user) => ({
      statusCode: 200,
      headers,
      body: JSON.stringify(user),
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message }),
      headers,
    }));
};
