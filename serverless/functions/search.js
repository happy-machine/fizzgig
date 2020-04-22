const connectToDatabase = require("../services/mongodb");
const { search } = require("../controllers/lib");

module.exports.fetchTicker = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  search(event.queryStringParameters.keywords)
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
