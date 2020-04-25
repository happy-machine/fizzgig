const moment = require("moment");
const User = require("../models/User");
const axios = require("axios");
const rateLimit = require("axios-rate-limit");
const allSettled = require("promise.allsettled");
const { format } = require("../controllers/lib");
const { updateUserTickers } = require("../controllers/userTickers");
const { setAsync } = require("../services/elasticache");
const { sendEmail } = require("../services/ses");
const { selectAlphaVantageKey } = require("../etc/lib");

async function run() {
  try {
    const symbols = await aggregateSymbols();
    const tickers = await Promise.all(fetchTickers(symbols));
    const transformed = transform(symbols, tickers);
    await allSettled(cacheSymbolsToRedis(transformed));
    // Add current symbol value of any subscribed symbols to redis to allow distributed retrieval
    const symbolnNotifiieBlob = await allSettled(
      makeListOfNotifiiesForSymbol(transformed)
    );
    console.dir(symbolnNotifiieBlob, { depth: 2 });
    try {
      const data = await allSettled(notifyNotifiies(symbolnNotifiieBlob));
      console.dir(data, { depth: 2 });
      // filter the users according to shouldNotify ruleset, and notify via email
      return data;
    } catch (e) {
      Promise.reject(new Error("Error in notifyNotifiies: ", e));
    }
  } catch (e) {
    return Promise.reject(new Error("Error in scheduler: ", e));
  }
}

const http = rateLimit(axios.create(), {
  maxRequests: 3,
  perMilliseconds: 1000,
  maxRPS: 3,
});

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
  transformed.filter(async (item) => {
    if (
      item.ticker["Global Quote"] &&
      item.ticker["Global Quote"]["05. price"]
    ) {
      const price = item.ticker["Global Quote"]["05. price"];
      return await setAsync(
        item.symbol,
        !price || price === "null" ? "N/A" : price,
        "EX",
        60 * 60 * 24
        /***
         * cache for 24 hours so that if symbols are
         * deleted they do not persist in redis
         **/
      ).catch((e) => throw new Error(`Error in cacheSymbolsToRedis: ${e}`));
    } else {
      return null;
    }
  });

const transform = (symbols, tickers) =>
  symbols.map((symbol, i) => ({
    symbol,
    ticker: tickers[i],
  }));

const fetchUsersForSymbol = (symbol) => {
  if (symbol) {
    return User.find({ "tickers.symbol": symbol });
  }
};

const makeListOfNotifiiesForSymbol = (transformed) =>
  transformed.map(async ({ symbol, ticker }) => {
    const usersWithSymbol = await fetchUsersForSymbol(symbol);
    return {
      ticker,
      users:
        usersWithSymbol &&
        usersWithSymbol.flat().filter((user) => {
          const userTickerForSymbol = user.tickers.find((userTicker) => {
            return (
              ticker["Global Quote"] &&
              ticker["Global Quote"]["01. symbol"] &&
              userTicker.symbol === ticker["Global Quote"]["01. symbol"]
            );
          });
          /**
           * find users with the current symbol and filter them according
           * to the shouldNotify conditions
           * */
          return userTickerForSymbol
            ? shouldNotify(userTickerForSymbol, ticker)
            : false;
        }),
    };
  });

const notifyNotifiies = (symbolnNotifiieBlob) =>
  symbolnNotifiieBlob
    .map((status, i) => {
      if (status.status === "fulfilled") {
        const { ticker, users } = symbolnNotifiieBlob[i].value;
        const promises = [];
        users.forEach((user) => {
          const userTicker = user.tickers.find(
            /**
             * there a lot of room for optimisation here, maybe use a Map to cache partial
             * partial user operations to. Beyond the time scope.
             **/
            (userTicker) =>
              ticker &&
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
              (ticker) => ticker && ticker !== userTicker
            );
            console.log("updating and sending: ", formatted);
            promises.push(
              updateUserTickers(user._id, [...otherTickers, updatedUserTicker])
              // update the last_notified field of the notified ticker
            );
            promises.push(sendEmail(formatted));
          }
        });
        return promises;
      } else {
        throw new Error(symbolnNotifiieBlob[i].value);
      }
    })
    .flat();

async function fetchTicker(symbol) {
  try {
    const response = await http.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${selectAlphaVantageKey()}`
    );
    return response.data;
  } catch (e) {
    throw new Error("Error in fetchTicker: ", e);
  }
}

module.exports = {
  shouldNotify,
  aggregateSymbols,
  run,
};
