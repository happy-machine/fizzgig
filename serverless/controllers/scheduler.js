const moment = require("moment");
const User = require("../models/User");
const { format } = require("../controllers/lib");
const { fetchTicker } = require("../controllers/ticker");
const { updateUserTickers } = require("../controllers/userTickers");
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
    console.log({ data });
    // filter the users according to shouldNotify ruleset, and notify via email
    return data;
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}

function shouldNotify(userTicker, ticker) {
  const price = parseFloat(ticker["Global Quote"]["05. price"]);
  const high = parseFloat(userTicker.notification_thresholds.high);
  const low = parseFloat(userTicker.notification_thresholds.low);
  if ((low && low > price) || (high && high < price)) {
    // we use zero as 'off' as stocks will never hit zero (well.. maybe dont quote me on that : P
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
  transformed.filter(async (item) => {
    if (
      item.ticker["Global Quote"] &&
      item.ticker["Global Quote"]["05. price"]
    ) {
      return await setAsync(
        item.symbol,
        item.ticker["Global Quote"]["05. price"],
        "EX",
        60 * 60 * 24
        /***
         * cache for 24 hours so that if symbols are
         * deleted they do not persist in redis
         **/
      );
    } else {
      return null;
    }
  });

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
        const userForSymbol = user.tickers.find(
          (userTicker) =>
            ticker["Global Quote"] &&
            ticker["Global Quote"]["01. symbol"] &&
            userTicker.symbol === ticker["Global Quote"]["01. symbol"]
        );
        /**
         * find users with the current symbol and filter them according
         * to the shouldNotify conditions
         * */
        return shouldNotify(userForSymbol, ticker);
      }),
    };
  });

const notifyNotifiies = (symbolnNotifiieBlob) =>
  symbolnNotifiieBlob
    .map(({ ticker, users }) => {
      const promises = [];
      users.forEach((user) => {
        const userTicker = user.tickers.find(
          /**
           * there a lot of room for optimisation here, maybe use a Map to cache partial
           * partial user operations to. Beyond the time scope.
           **/
          (userTicker) =>
            ticker["Global Quote"] &&
            ticker["Global Quote"]["01. symbol"] &&
            userTicker.symbol === ticker["Global Quote"]["01. symbol"]
        );
        if (userTicker) {
          const formatted = format(user, userTicker, ticker);
          const updatedUserTicker = {
            ...userTicker._doc,
            last_notified: moment.utc()._d,
          };
          const otherTickers = user.tickers.filter(
            (ticker) => ticker !== userTicker
          );
          promises.push(
            updateUserTickers(user._id, [...otherTickers, updatedUserTicker])
            // update the last_notified field of the notified ticker
          );
          promises.push(sendEmail(formatted));
        }
      });
      return promises;
    })
    .flat();

module.exports = {
  shouldNotify,
  aggregateSymbols,
  run,
};
