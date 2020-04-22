const connectToDatabase = require("../services/mongodb");
const { fetchTicker } = require("../controllers/lib");
const { headers } = require("../etc/lib");

module.exports.fetchTicker = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => fetchTicker(event.queryStringParameters.ticker))
    .then((user) => ({
      statusCode: 200,
      body: JSON.stringify({ message: err.message }),
      body: JSON.stringify(user),
      headers,
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      headers,
    }));
};
