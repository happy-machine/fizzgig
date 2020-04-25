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
    console.log(`updating ${userId} with ${tickers}`);
    await User.updateOne({ _id: userId }, { tickers });
    const user = await User.findById(userId);
    return user;
  } catch (e) {
    console.log("error in update");
    return Promise.reject(new Error(e));
  }
}

module.exports = {
  getUser,
  updateUserTickers,
};
