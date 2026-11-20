import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

function getCleanEnv(key: string): string | undefined {
  const val = (process.env[key] || '').trim();
  if (!val || val === `MY_${key}` || val.startsWith('MY_')) return undefined;
  return val;
}

function resolvePoolConfig(): PoolConfig {
  // 1. Primary: Cloud SQL / explicit Object Method env vars
  let host = getCleanEnv('SQL_HOST') || getCleanEnv('PGHOST') || getCleanEnv('POSTGRES_HOST');
  let user = getCleanEnv('SQL_USER') || getCleanEnv('PGUSER') || getCleanEnv('POSTGRES_USER');
  let password =
    getCleanEnv('SQL_PASSWORD') || getCleanEnv('PGPASSWORD') || getCleanEnv('POSTGRES_PASSWORD');
  let database =
    getCleanEnv('SQL_DB_NAME') || getCleanEnv('PGDATABASE') || getCleanEnv('POSTGRES_DATABASE');
  let port = Number(getCleanEnv('PGPORT') || getCleanEnv('POSTGRES_PORT') || 5432);

  // 2. Fallback: Parse Vercel Neon/Postgres integration URL into Object Method fields
  const vercelPgUrl =
    getCleanEnv('POSTGRES_URL') ||
    getCleanEnv('POSTGRES_PRISMA_URL') ||
    getCleanEnv('POSTGRES_URL_NON_POOLING');

  if ((!host || !user || !database) && vercelPgUrl) {
    try {
      const parsed = new URL(vercelPgUrl);
      host = host || parsed.hostname;
      user = user || decodeURIComponent(parsed.username);
      password = password || decodeURIComponent(parsed.password);
      database = database || parsed.pathname.replace(/^\//, '');
      if (parsed.port) {
        port = Number(parsed.port);
      }
    } catch (err) {
      console.error('Failed to parse POSTGRES_URL:', err);
    }
  }

  const isCloudSqlInternal =
    process.env.VERCEL !== '1' &&
    Boolean(getCleanEnv('SQL_HOST')) &&
    !host?.includes('neon.tech') &&
    !host?.includes('supabase');
  const needsSsl =
    !isCloudSqlInternal &&
    Boolean(
      process.env.VERCEL === '1' ||
        process.env.PGSSLMODE === 'require' ||
        host?.includes('neon.tech') ||
        host?.includes('supabase') ||
        host?.includes('vercel') ||
        vercelPgUrl?.includes('sslmode=require')
    );

  return {
    host,
    port,
    user,
    password,
    database,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: process.env.VERCEL === '1' ? 5 : 10,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 15000,
  };
}

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool(resolvePoolConfig());

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

export const pool = createPool();

export const db = drizzle(pool, { schema });
