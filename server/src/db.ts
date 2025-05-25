import { Pool } from 'pg';

/**
 * Database connection pool with query logging.
 * Each query logs SQL and params to the console.
 */
const pool = new Pool();

// Query logger for debugging
const originalQuery = pool.query.bind(pool);
pool.query = (function (...args: any[]) {
    console.log('[SQL]', args[0], args[1] || '');
    // @ts-ignore
    return originalQuery(...args);
}) as typeof pool.query;

// Test DB connection on startup
if (require.main === module) {
  pool.query('SELECT NOW()')
    .then(res => {
      console.log('DB connected:', res.rows[0]);
    })
    .catch(err => {
      console.error('DB connection error:', err);
      if (process.env.NODE_ENV !== 'test') process.exit(1);
    });
}

export default pool;
