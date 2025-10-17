const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faqs');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching FAQs:', err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

module.exports = router;
