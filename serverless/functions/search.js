const connectToDatabase = require("../services/mongodb");
const { search } = require("../controllers/lib");
const { headers } = require("../etc/lib");

module.exports.fetchTicker = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  search(event.queryStringParameters.keywords)
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
