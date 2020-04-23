const connectToDatabase = require("../services/mongodb");
const { fetchTicker } = require("../controllers/ticker");
const { headers } = require("../etc/lib");

module.exports.fetchTicker = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => fetchTicker(event.queryStringParameters.ticker))
    .then((response) => ({
      statusCode: 200,
      body: JSON.stringify(response),
      headers,
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message }),
      headers,
    }));
};
