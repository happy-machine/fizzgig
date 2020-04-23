const { search } = require("../controllers/search");
const { headers } = require("../etc/lib");

module.exports.search = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return search(event.queryStringParameters.keywords)
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
