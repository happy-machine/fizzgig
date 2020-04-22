const User = require("../models/User");

async function getUser(userId) {
  try {
    const user = await User.findById(userId, { password: 0 });
    return !user ? Promise.reject("No user found.") : user;
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}

async function updateUserTickers(userId, tickers) {
  try {
    console.log("In error userId ", userId, " tickers: ", tickers);
    const user = await User.findById(userId);
    console.log("GOT USER BY ID: ", user);
    user["tickers"] = tickers;
    const result = await user.save();
    return result;
  } catch (e) {
    console.log("in ERROR!!");
    return Promise.reject(new Error(e));
  }
}

module.exports = {
  getUser,
  updateUserTickers,
};
