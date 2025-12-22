import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const developmentConfig = defineConfig({
  out: './migrations',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_DEVELOPMENT!,
  },
});

const productionConfig = defineConfig({
  out: './migrations',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_PRODUCTION!,
  },
});

export default process.env.APP_ENV === 'production' ? productionConfig : developmentConfig;