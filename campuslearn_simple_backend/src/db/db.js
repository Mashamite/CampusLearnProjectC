require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl:false
})


pool.connect()
  .then(client => {
    console.log('Database connected successfully')
    client.release()
  })
  .catch(err => console.error('Database connection error:', err.message))

module.exports = pool
