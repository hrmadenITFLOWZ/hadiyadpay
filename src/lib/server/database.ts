import 'server-only';

import dns from 'node:dns';

import { Pool } from 'pg';

dns.setDefaultResultOrder('ipv4first');

let pool: Pool | undefined;

function getConnectionString(): string {
  const connectionString =
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not configured',
    );
  }

  let databaseUrl: URL;

  try {
    databaseUrl = new URL(
      connectionString,
    );
  } catch {
    throw new Error(
      'DATABASE_URL is invalid',
    );
  }

  if (
    databaseUrl.protocol !== 'postgres:' &&
    databaseUrl.protocol !== 'postgresql:'
  ) {
    throw new Error(
      'DATABASE_URL must be a PostgreSQL connection string',
    );
  }

  databaseUrl.searchParams.delete(
    'sslmode',
  );

  databaseUrl.searchParams.delete(
    'channel_binding',
  );

  return databaseUrl.toString();
}

export function getDatabasePool(): Pool {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString:
      getConnectionString(),

    ssl: {
      rejectUnauthorized: true,
    },

    max: 5,
    min: 0,

    connectionTimeoutMillis: 20_000,

    idleTimeoutMillis: 5_000,

    keepAlive: true,
    keepAliveInitialDelayMillis: 1_000,

    allowExitOnIdle: true,

    application_name:
      'hadiyadpay-web',
  });

  pool.on('error', (error) => {
    console.error(
      'Unexpected idle PostgreSQL pool error',
      {
        errorType: error.name,
        errorCode:
          'code' in error
            ? String(error.code)
            : 'unknown',
      },
    );
  });

  return pool;
}