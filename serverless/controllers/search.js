const axios = require("axios");
const rateLimit = require("axios-rate-limit");
const { selectAlphaVantageKey } = require("../etc/lib");

const searchHttp = rateLimit(axios.create(), {
  perMilliseconds: 1000,
  maxRPS: 1,
});
// temporary debounce hack due to time restraints!
searchHttp.getMaxRPS();

async function search(keywords) {
  console.log("in request");
  try {
    const response = await searchHttp.get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${selectAlphaVantageKey()}`
    );
    console.log("in response with: ", response.data);
    return response.data;
  } catch (e) {
    console.log("in catch");
    throw new Error(e);
  }
}

module.exports = {
  search,
};
