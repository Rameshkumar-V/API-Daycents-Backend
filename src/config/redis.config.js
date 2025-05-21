const { createClient } = require('redis');
require('dotenv').config();

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 10000 // 10 seconds
  }
});


redis.on('connect', () => {
  console.log('Redis client connecting...');
});

redis.on('ready', () => {
  console.log('Redis client connected and ready.');
});

redis.on('end', () => {
  console.log('Redis client disconnected.');
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

(async () => {
  try {
    await redis.connect();
    console.log('Successfully connected to Redis.');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    // Exit process or handle the failure as needed
    process.exit(1);
  }
})();

module.exports = redis;

