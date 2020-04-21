const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient(process.env.ELASTICACHE_URL);

client.on("error", function (e) {
  throw new Error(e);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {
  getAsync,
  setAsync,
};
