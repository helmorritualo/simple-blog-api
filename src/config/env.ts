import { config } from 'dotenv';

config({ path: '.env' });
export const { PORT, JWT_SECRET, MONGO_URL, NODE_ENV } = process.env;
