import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';

config({path: '.env'});

export const db = process.env.APP_ENV === 'production' ? drizzle(process.env.DATABASE_URL_PRODUCTION!) : drizzle(process.env.DATABASE_URL_DEVELOPMENT!);