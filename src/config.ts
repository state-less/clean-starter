import dotenv from 'dotenv';

dotenv.config();

const {
  TABLE_NAME,
  LOG_LEVEL,
  PG_USER,
  PG_PASSWORD,
  PORT,
  SECRET = 'mysecret',
} = process.env;

export { TABLE_NAME, LOG_LEVEL, PG_PASSWORD, PG_USER, PORT, SECRET };
