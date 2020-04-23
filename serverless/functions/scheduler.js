const connectToDatabase = require("../services/mongodb");
const { run } = require("../controllers/scheduler");

module.exports.runScheduler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => run())
    .then((data) => ({
      statusCode: 200,
      body: JSON.stringify(data),
    }))
    .catch((err) => ({
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ message: err.message }),
    }));
};
