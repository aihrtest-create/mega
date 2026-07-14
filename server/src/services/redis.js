import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// В докере хост "redis" — имя сервиса из docker-compose.
// Для локальной разработки задайте REDIS_URL=redis://localhost:6379 в server/.env
const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
});

// Без обработчика ioredis роняет процесс необработанным 'error'-событием
redis.on('error', (e) => console.warn(`[REDIS] ${e.message}`));
