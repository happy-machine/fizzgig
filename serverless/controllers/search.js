const axios = require("axios");
const rateLimit = require("axios-rate-limit");
const { selectAlphaVantageKey } = require("../etc/lib");

const searchHttp = rateLimit(axios.create(), {
  maxRequests: 1,
  perMilliseconds: 1000,
  maxRPS: 1,
});
// temporary debounce hack due to time restraints!

async function search(keywords) {
  try {
    const response = await searchHttp.get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${selectAlphaVantageKey()}`
    );
    console.log("in response with: ", response.data);
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = {
  search,
};
