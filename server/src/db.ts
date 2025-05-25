import { Pool } from 'pg';

const pool = new Pool();

const originalQuery = pool.query.bind(pool);
pool.query = (function (...args: any[]) {
    console.log('[SQL]', args[0], args[1] || '');
    // @ts-ignore
    return originalQuery(...args);
}) as typeof pool.query;

export default pool;