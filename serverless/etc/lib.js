const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": true,
  "Access-Control-Allow-Methods": true,
  "Access-Control-Allow-Credentials": true,
};

const selectAlphaVantageKey = () => {
  const keyOrArray = process.env.ALPHA_VANTAGE_API_KEYS.split(",");
  const randomIndex = Math.floor(Math.random(keyOrArray.length));
  return keyOrArray[randomIndex];
  /***
   * If we add more than one key this gives allows
   * to exceed the daily and minute rate limits
   ***/
};

module.exports = {
  headers,
  selectAlphaVantageKey,
};
