const { getAsync } = require("../services/elasticache");

async function run(symbols) {
  const parsedSymbols = JSON.parse(symbols);
  const symbolsValues = parsedSymbols.symbols;
  try {
    if (!Array.isArray(symbolsValues)) {
      return {
        symbol: symbolsValues,
        stockValue: await getAsync(symbolsValues),
      };
    }
    const blob = await Promise.all(fetchSymbolsFromRedis(symbolsValues));
    return blob;
  } catch (e) {
    Promise.reject(new Error(e));
  }
}

const fetchSymbolsFromRedis = (symbols) => {
  console.log("in fetch symbols with ", symbols, Array.isArray(symbols));
  return symbols.map(async (symbol) => ({
    symbol,
    stockValue: await getAsync(symbol),
  }));
};

module.exports = {
  run,
};
