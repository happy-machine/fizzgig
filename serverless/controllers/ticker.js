const axios = require("axios");
const rateLimit = require("axios-rate-limit");
const { selectAlphaVantageKey } = require("../controllers/lib");

const http = rateLimit(axios.create(), { perMilliseconds: 1000, maxRPS: 3 });
http.getMaxRPS();

async function fetchTicker(symbol) {
  try {
    const response = await http.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${selectAlphaVantageKey()}`
    );
    console.log("response to ticker: ", response.data);
    return response.data;
  } catch (e) {
    throw new Error("Error in controller/ticker", e);
  }
}

module.exports = {
  fetchTicker,
};
