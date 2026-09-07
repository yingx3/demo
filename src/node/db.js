import pg from 'pg'

const { Pool } = pg

// 共享数据库连接池：避免每个请求都新建 Pool 导致连接泄漏
export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  port: 5432,
})

export default pool
