const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/auth')

router.get('/', requireAuth, async (req, res) => {
  const pool = req.app.locals.pool
  const user = req.user
  const r = await pool.query("SELECT m.*, u.name as other_name FROM messages m LEFT JOIN users u ON (CASE WHEN m.from_user=$1 THEN m.to_user ELSE m.from_user END)=u.id WHERE m.from_user=$1 OR m.to_user=$1 ORDER BY m.sent_at DESC", [user.id])
  res.json(r.rows)
})

router.post('/', requireAuth, async (req, res) => {
  const pool = req.app.locals.pool
  const { to_user, content } = req.body
  const user = req.user
  const r = await pool.query('INSERT INTO messages (from_user,to_user,content) VALUES ($1,$2,$3) RETURNING *', [user.id,to_user,content])
  res.json(r.rows[0])
})

module.exports = router
