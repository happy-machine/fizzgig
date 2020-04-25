const User = require("../models/User");

async function getUser(userId) {
    const user = await User.findById(userId, { password: 0 });
    return !user ? Promise.reject("No user found.") : user;
}

async function updateUserTickers(userId, tickers) {
    console.log(`updating ${userId} with ${tickers}`);
    await User.updateOne({ _id: userId }, { tickers });
    const user = await User.findById(userId);
    return user;
}

module.exports = {
  getUser,
  updateUserTickers,
};
