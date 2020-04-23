import { IUser, IUserTicker, ITicker } from "../components/types";

export const mapUserToSymbols = (user: IUser) =>
  user?.tickers?.map((ticker: IUserTicker) => ticker.symbol);

export const mapTickersToMap = (tickers: ITicker[]) => {
  console.log({ tickers });
  const newMap = new Map();
  tickers?.map((ticker) => newMap.set(ticker.symbol, ticker.stockValue));
  return newMap;
};

export function toFixed(num: string, fixed: number) {
  if (num !== null) {
    return new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  }
}
