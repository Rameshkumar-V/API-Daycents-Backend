const { createClient } = require('redis');
require('dotenv').config();
const redis = createClient({
  url: process.env.REDIS_URL, // Replace with your cloud URL if needed
});
'redis://localhost:6379'
redis.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redis.connect();
})();


module.exports = redis;
