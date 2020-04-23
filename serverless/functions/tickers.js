const { run } = require("../controllers/tickers");
const { headers } = require("../etc/lib");

module.exports.fetchTickers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return run(event.body)
    .then((response) => ({
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message }),
      headers,
    }));
};
