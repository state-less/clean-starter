import dotenv from 'dotenv';

dotenv.config();

const {
  LOG_LEVEL, PORT
} = process.env;

export { LOG_LEVEL, PORT };
