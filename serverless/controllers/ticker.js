const axios = require("axios");
const rateLimit = require("axios-rate-limit");

const http = rateLimit(axios.create(), { perMilliseconds: 1000, maxRPS: 5 });
http.getMaxRPS();

async function fetchTicker(symbol) {
  try {
    const response = await http.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    console.log("response to ticker: ", response.data);
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = {
  fetchTicker,
};
