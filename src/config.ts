import dotenv from 'dotenv';

dotenv.config();

const {
    LOG_LEVEL,
    PORT,
    JWT_SECRET = 'secret',
    PG_PASSWORD,
    PG_PORT = 5433,
    VAPID_PRIVATE,
    VAPID_PUBLIC,
} = process.env;

export {
    LOG_LEVEL,
    PG_PORT,
    PORT,
    JWT_SECRET,
    VAPID_PRIVATE,
    VAPID_PUBLIC,
    PG_PASSWORD,
};
