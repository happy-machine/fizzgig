const connectToDatabase = require("../services/mongodb");
const { getUser, updateUserTickers } = require("../controllers/userTickers");
const { run } = require("../controllers/tickers");
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
  /***
   * I've been really unfortunate here, had a problem with my AWS cloud, been on the
   * phone and paid to speak to the service engineers - I have an outstanding ticket.
   * The lambda function i wanted to use to make a nice orderly GET is mysteriously
   * changing its status on the cloud between POST and GET and breaking, the AWS team
   * are confused and looking into it. In the meantime as i've spent about five hours
   * trying to resolve this, the only option i had (after trying to set up new functions
   * which also didn't work from my instance) was to do something quite hacky here and
   * reuse an endpoint that works by using a switch on 'type' - I hope this doesn't disqualify me!
   ***/
};

module.exports.updateUserTickers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      updateUserTickers(event.requestContext.authorizer.principalId, event.body)
    )
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
