const mongoose = require("mongoose");
const userTickers = new mongoose.Schema({
  name: String,
  ticker: String,
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  tickers: { type: Map, of: userTickers },
});

mongoose.model("User", UserSchema);

module.exports = mongoose.model("User");
