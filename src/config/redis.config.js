// redisClient.js
const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL, {
  tls: {}, // This enables TLS for rediss://
});

redis.on('connect', () => console.log('[Redis] Connecting...'));
redis.on('ready', () => console.log('[Redis] Ready!'));
redis.on('error', (err) => console.error('[Redis] Error:', err));

module.exports = redis;
