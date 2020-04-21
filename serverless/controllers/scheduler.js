const moment = require("moment");
const User = require("../models/User");
const { fetchTicker, format } = require("../controllers/lib");
const { setAsync } = require("../services/elasticache");
const { sendEmail } = require("../services/ses");

async function run() {
  try {
    const symbols = await aggregateSymbols();
    const tickers = await Promise.all(fetchTickers(symbols));
    const transformed = transform(symbols, tickers);
    await Promise.all(cacheSymbolsToRedis(transformed));
    // Add current symbol value of any subscribed symbols to redis to allow distributed retrieval
    const symbolnNotifiieBlob = await Promise.all(
      makeListOfNotifiiesForSymbol(transformed)
    );
    const data = await Promise.all(notifyNotifiies(symbolnNotifiieBlob));
    // filter the users according to shouldNotify ruleset, and notify via email
    return data.flat();
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}

function shouldNotify(userTicker, ticker) {
  const price = parseFloat(ticker["Global Quote"]["05. price"]);
  const high = parseFloat(userTicker.notification_thresholds.high);
  const low = parseFloat(userTicker.notification_thresholds.low);
  if (low > price || high < price) {
    if (!userTicker.should_notify) return false;
    const lastNotified = moment(userTicker.last_notified);
    if (moment().diff(lastNotified, "hours") > process.env.ALERT_DELAY_HOURS) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

const aggregateSymbols = () => User.distinct("tickers.symbol");

const fetchTickers = (symbols) => symbols.map((symbol) => fetchTicker(symbol));

const cacheSymbolsToRedis = (transformed) =>
  transformed.map(
    async (item) =>
      await setAsync(
        item.symbol,
        item.ticker["Global Quote"]["05. price"],
        "EX",
        60 * 60 * 24
        /***
         * cache for 24 hours so that if symbols are
         * deleted they do not persist in redis
         **/
      )
  );

const transform = (symbols, tickers) =>
  symbols.map((symbol, i) => ({
    symbol,
    ticker: tickers[i],
  }));

const fetchUsersForSymbol = (symbol) => User.find({ "tickers.symbol": symbol });

const makeListOfNotifiiesForSymbol = (transformed) =>
  transformed.map(async ({ symbol, ticker }) => {
    const usersWithSymbol = await fetchUsersForSymbol(symbol);
    return {
      ticker,
      users: usersWithSymbol.filter((user) => {
        const userTickerForSymbol = user.tickers.find(
          (userTicker) =>
            userTicker.symbol === ticker["Global Quote"]["01. symbol"]
        );
        return shouldNotify(userTickerForSymbol, ticker);
      }),
    };
  });
// If i had more time i would definetely write some tests for the above

const notifyNotifiies = (symbolnNotifiieBlob) =>
  symbolnNotifiieBlob.map(
    async ({ ticker, users }) =>
      await Promise.all(
        users.map(async (user) => {
          const userTicker = user.tickers.find(
            (userTicker) =>
              userTicker.symbol === ticker["Global Quote"]["01. symbol"]
          );
          if (userTicker) {
            const formatted = format(user, userTicker, ticker);
            try {
              return sendEmail(formatted);
            } catch (e) {
              throw new Error(e);
            }
          }
        })
      )
  );

module.exports = {
  shouldNotify,
  aggregateSymbols,
  run,
};
