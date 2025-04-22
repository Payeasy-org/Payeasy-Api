
import session from 'express-session';
import { createClient, RedisClientType } from 'redis';
import { RedisStore } from 'connect-redis';
import { User } from '@/api/user/models/user.model';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, SESSION_SECRET } = process.env;
if (!REDIS_HOST || !REDIS_PORT || !REDIS_PASSWORD || !SESSION_SECRET) {
    throw new Error('Missing REDIS_/SESSION_SECRET env vars');
}

const redisUrl = `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;
const redisClient: RedisClientType = createClient({ url: redisUrl });
redisClient
    .connect()
    .then(() => console.log('✅ Redis connected'))
    .catch((err) => {
        console.error('❌ Redis error:', err);
        process.exit(1);
    });

const THREE_HOURS = 3 * 60 * 60 * 1000;
export const redisStore = new RedisStore({ client: redisClient, ttl: THREE_HOURS / 1000 });

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


redisStore.on('destroy', async (sid: string) => {
    await User.update({ sessionId: null as unknown as string }, { where: { sessionId: sid } });
});
