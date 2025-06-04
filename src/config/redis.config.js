const { createClient } = require('redis');
require('dotenv').config();

let isConnected = false;

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 10000, // 10 seconds
    reconnectStrategy: (retries) => {
      console.warn(`[Redis] Reconnect attempt #${retries}`);
      return Math.min(retries * 100, 3000); // Retry with backoff
    }
  }
});

redis.on('connect', () => console.log('[Redis] Connecting...'));
redis.on('ready', () => {
  console.log('[Redis] Connected & Ready');
  isConnected = true;
});
redis.on('end', () => {
  console.warn('[Redis] Connection ended.');
  isConnected = false;
});
redis.on('error', (err) => {
  console.error('[Redis] Error:', err);
  isConnected = false;
});

const connectRedis = async () => {
  if (!isConnected) {
    try {
      await redis.connect();
      isConnected = true;
    } catch (err) {
      console.error('[Redis] Failed to connect:', err);
      process.exit(1); // Optional: Fail fast
    }
  }
};

module.exports = { redis, connectRedis };
