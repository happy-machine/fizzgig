const axios = require("axios");
const moment = require("moment");
const rateLimit = require("axios-rate-limit");

const http = rateLimit(axios.create(), { perMilliseconds: 1000, maxRPS: 5 });
http.getMaxRPS();
// limit requests to be within freemium tier rate limit

async function fetchTicker(symbol) {
  try {
    const response = await http.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
}

async function search(keywords) {
  try {
    const response = await http.get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
}

function format(user, userTicker, ticker) {
  const header = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="https://www.w3.org/1999/xhtml">
  <head>
  <title>Fizzgig Email Stock Alert</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
  </head>`;
  const { email, name } = user;

  const subject = `${userTicker.name} at ${ticker["Global Quote"]["05. price"]}`;
  const body =
    header +
    `<body><b>Hello ${name}</b>` +
    "<BR></BR><BR></BR>" +
    `You asked for a notification when ${userTicker.name} ` +
    `exceeded ${userTicker.notification_thresholds.high} or fell below ${userTicker.notification_thresholds.low}.<BR></BR>` +
    `${userTicker.name} is currently trading at ${ticker["Global Quote"]["05. price"]}.<BR></BR><BR></BR><BR></BR>` +
    `<i>Sent by Fizzgig at ${moment().format("LT")}</i></body></html>`;

  return {
    source: process.env.EMAIL_ADDRESS,
    addresses: [email],
    subject,
    body,
  };
}

module.exports = {
  fetchTicker,
  search,
  format,
};
