const moment = require("moment");

function shouldNotify(userTicker, ticker) {
  const price = parseFloat(ticker["Global Quote"]["05. price"]);
  const high = parseFloat(userTicker.notification_thresholds.high);
  const low = parseFloat(userTicker.notification_thresholds.low);
  if (low > price || high < price) {
    if (!userTicker.should_notify) return false;
    const lastNotified = moment(userTicker.last_notified);
    if (moment().diff(lastNotified, "hours") > process.env.ALERT_DELAY_HOURS) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

module.exports = {
  shouldNotify,
};
