const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/auth')

router.get('/', async (req, res) => {
  const pool = req.app.locals.pool
  const r = await pool.query('SELECT t.*, m.name as module_name FROM topics t LEFT JOIN modules m ON m.id=t.module_id ORDER BY t.created_at DESC')
  res.json(r.rows)
})

router.get('/:id', async (req, res) => {
  const pool = req.app.locals.pool
  const id = Number(req.params.id)
  const r = await pool.query('SELECT * FROM topics WHERE id=$1', [id])
  if (r.rowCount===0) return res.status(404).json({ message: 'Not found' })
  const topic = r.rows[0]
  const mats = await pool.query('SELECT * FROM materials WHERE topic_id=$1', [id])
  topic.materials = mats.rows
  res.json(topic)
})

router.post('/', requireAuth, async (req, res) => {
  const pool = req.app.locals.pool
  const { title, description, module_id } = req.body
  const user = req.user
  const r = await pool.query('INSERT INTO topics (title,description,module_id,creator_id) VALUES ($1,$2,$3,$4) RETURNING *', [title,description,module_id,user.id])
  res.json(r.rows[0])
})

module.exports = router
