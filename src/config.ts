import dotenv from 'dotenv';

dotenv.config();

const {
    LOG_LEVEL,
    PORT,
    JWT_SECRET = 'secret',
    PG_PASSWORD,
    VAPID_PRIVATE,
    VAPID_PUBLIC,
    FORUM_KEY = 'my-forum',
    ADMIN_EMAIL,
} = process.env;

export {
    LOG_LEVEL,
    PORT,
    JWT_SECRET,
    VAPID_PRIVATE,
    VAPID_PUBLIC,
    PG_PASSWORD,
    FORUM_KEY,
    ADMIN_EMAIL,
};
