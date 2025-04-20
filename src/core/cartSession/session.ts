

import session from 'express-session';
import { createClient, type RedisClientType } from 'redis';
import { RedisStore } from 'connect-redis';
import { User } from '@/api/user/models/';

// Pull REDIS variables from env
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, SESSION_SECRET } = process.env;
if (!REDIS_HOST || !REDIS_PORT || !REDIS_PASSWORD || !SESSION_SECRET) {
    throw new Error('Missing Redis or Session secret environment variables');
}

// Build Redis URL
const redisUrl = `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;

// Create & connect Redis client
const redisClient: RedisClientType = createClient({ url: redisUrl });
redisClient
    .connect()
    .then(() => console.log('✅ Redis client connected'))
    .catch((err) => {
        console.error('❌ Redis connection error:', err);
        process.exit(1);
    });

// Session TTL: 3 hours
const THREE_HOURS = 3 * 60 * 60 * 1000;

// Instantiate RedisStore
const redisStore = new RedisStore({ client: redisClient, ttl: THREE_HOURS / 1000 });

// Initialize session middleware
export const sessionMiddleware = session({
    store: redisStore,
    name: 'sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: THREE_HOURS,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    },
});

// Listen for session destroy and clear user.sessionId
redisStore.on('destroy', async (sid: string, callback: (...args: any[]) => void) => {
    console.log(`Session destroyed: ${sid}`);
    try {
        await User.update({ sessionId: null as unknown as string }, { where: { sessionId: sid } });
    } catch (err) {
        console.error('Error clearing user sessionId:', err);
    }
    callback && callback();
});
