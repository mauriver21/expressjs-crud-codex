import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';
const envFileNames = {
  test: '.env.test',
  development: '.env.dev',
  production: '.env.prod',
};
const envFileName = envFileNames[environment as keyof typeof envFileNames] || '.env.dev';

dotenv.config({ path: path.resolve(__dirname, '..', '..', envFileName) });

export const config = {
  environment,
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  port: process.env.PORT || 3000,
  db: {
    dialect: (process.env.DB_DIALECT || 'postgresql') as 'postgresql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'change-me',
    database: process.env.DB_NAME || '__APP_NAME__',
  },
};

export const databaseUrl = `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;
