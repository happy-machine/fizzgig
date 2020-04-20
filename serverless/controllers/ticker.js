function getTickerValues(user) {
  return user.tickers.map((ticker) => ticker.symbol);
}

module.exports = {
  getTickerValues,
};
