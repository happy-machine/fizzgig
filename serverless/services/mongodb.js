const mongoose = require("mongoose");
let isConnected;

module.exports = connectToDatabase = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return Promise.resolve();
  }

  console.log("Using new database connection");
  try {
    const db = await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    const connection = db.connections[0];
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};
