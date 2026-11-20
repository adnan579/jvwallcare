import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

const sqlHost = process.env.SQL_HOST || process.env.PGHOST || process.env.POSTGRES_HOST;
const sqlDbName = process.env.SQL_DB_NAME || process.env.PGDATABASE || process.env.POSTGRES_DATABASE;
const user = process.env.SQL_ADMIN_USER || process.env.PGUSER || process.env.POSTGRES_USER;
const password =
  process.env.SQL_ADMIN_PASSWORD || process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;

if (!sqlHost) {
  throw new Error('SQL_HOST (or PGHOST / POSTGRES_HOST) must be set in environment variables.');
}
if (!sqlDbName) {
  throw new Error(
    'SQL_DB_NAME (or PGDATABASE / POSTGRES_DATABASE) must be set in environment variables.'
  );
}
if (!user) {
  throw new Error('SQL_ADMIN_USER (or PGUSER / POSTGRES_USER) must be set in environment variables.');
}
if (!password) {
  throw new Error(
    'SQL_ADMIN_PASSWORD (or PGPASSWORD / POSTGRES_PASSWORD) must be set in environment variables.'
  );
}
console.log(`Using user: ${user} to connect to database.`);

const isRemoteNeon = Boolean(
  sqlHost.includes('neon.tech') || sqlHost.includes('supabase') || process.env.PGSSLMODE === 'require'
);

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: {
    host: sqlHost,
    user: user,
    password: password,
    database: sqlDbName,
    ssl: isRemoteNeon ? 'require' : false,
  },
  verbose: true,
});
