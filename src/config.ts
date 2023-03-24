import dotenv from 'dotenv';

dotenv.config();

const { LOG_LEVEL, PORT, JWT_SECRET = 'secret' } = process.env;

export { LOG_LEVEL, PORT, JWT_SECRET };
