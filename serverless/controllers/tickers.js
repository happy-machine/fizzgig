const { getAsync } = require("../services/elasticache");

async function run(symbols) {
  const parsedSymbols = JSON.parse(symbols);
  const symbolsValues = parsedSymbols.symbols;
    if (!Array.isArray(symbolsValues)) {
      return {
        symbol: symbolsValues,
        stockValue: await getAsync(symbolsValues),
      };
    }
    const blob = await Promise.all(fetchSymbolsFromRedis(symbolsValues));
    return blob;
}

const fetchSymbolsFromRedis = (symbols) => {
  return symbols.map(async (symbol) => ({
    symbol,
    stockValue: await getAsync(symbol),
  }));
};

module.exports = {
  run,
};
