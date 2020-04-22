const connectToDatabase = require("../services/mongodb");
const { fetchTickers } = require("../controllers/tickers");

module.exports.fetchTickers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => fetchTickers(event.requestContext.authorizer.principalId))
    .then((user) => ({
      statusCode: 200,
      body: JSON.stringify(user),
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: err.message }),
    }));
};
