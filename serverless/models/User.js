const mongoose = require("mongoose");
const moment = require("moment");
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  tickers: [
    {
      name: String,
      symbol: String,
      should_notify: { type: Boolean, default: false },
      last_notified: {
        type: Date,
        default: moment().subtract(process.env.ALERT_DELAY_HOURS, "hours"),
      },
      notification_thresholds: {
        high: { type: Number, default: 1000000 },
        low: { type: Number, default: 0 },
      },
    },
  ],
});

mongoose.model("User", UserSchema);

module.exports = mongoose.model("User");
