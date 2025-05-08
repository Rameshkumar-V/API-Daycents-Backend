const { createClient } = require('redis');

const redis = createClient({
  url: 'redis://localhost:6379', // Replace with your cloud URL if needed
});

redis.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redis.connect();
})();


module.exports = redis;
