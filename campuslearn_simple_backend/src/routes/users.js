const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/auth')

router.get('/me', requireAuth, async (req, res) => {
  const pool = req.app.locals.pool
  const user = await pool.query('SELECT id,name,email,role,created_at FROM users WHERE id=$1', [req.user.id])
  res.json(user.rows[0])
})

module.exports = router
