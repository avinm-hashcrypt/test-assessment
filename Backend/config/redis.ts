import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redisClient.connect()
    .then(() => {
        console.log('Connected to Redis');
        return redisClient.ping();
    })
    .then((result) => {
        console.log('Redis Ping Response:', result); // Should return 'PONG'
    })
    .catch((err) => {
        console.error('Redis connection failed:', err);
    });

export default redisClient;
