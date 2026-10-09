const { Pool } = require("pg");

const pool = new Pool({
  ...(process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
    ? { connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
});

module.exports = pool;