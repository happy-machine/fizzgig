const User = require("../models/User");

async function getUser(userId) {
  try {
    const user = await User.findById(userId, { password: 0 });
    return !user ? Promise.reject("No user found.") : user;
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}

module.exports = {
  getUser,
};
