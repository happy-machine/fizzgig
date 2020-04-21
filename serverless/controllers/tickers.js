const { getAsync, setAsync } = require("../services/elasticache");

function run(userId) {
  return fetchSymbolsFromRedis(userId);
  //return "boom";
}
async function fetchSymbolsForUser() {}

async function fetchTickerValues(user) {
  return user.tickers.map((ticker) => ticker.symbol);
}

async function fetchSymbolsFromRedis(symbols) {
  return await getAsync("key");
}

module.exports = {
  run,
};
