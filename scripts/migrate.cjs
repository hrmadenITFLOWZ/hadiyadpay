const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

async function main() {
  const connectionString =
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not configured',
    );
  }

  const migrationsDirectory =
    path.join(
      process.cwd(),
      'db',
      'migrations',
    );

  const migrations =
    fs
      .readdirSync(
        migrationsDirectory,
      )
      .filter(
        (file) =>
          file.endsWith('.sql'),
      )
      .sort();

  const client =
    new Client({
      connectionString,
    });

  await client.connect();

  try {
    for (const migration of migrations) {
      const migrationPath =
        path.join(
          migrationsDirectory,
          migration,
        );

      const sql =
        fs.readFileSync(
          migrationPath,
          'utf8',
        );

      console.log(
        `Running migration: ${migration}`,
      );

      await client.query(sql);
    }

    console.log(
      `Successfully applied ${migrations.length} migration(s).`,
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(
    'Database migration failed:',
    error instanceof Error
      ? error.message
      : error,
  );

  process.exit(1);
});