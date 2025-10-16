const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/auth')

router.get('/posts', async (req, res) => {
  const pool = req.app.locals.pool
  const r = await pool.query('SELECT p.*, u.name as author_name FROM forum_posts p LEFT JOIN users u ON u.id=p.author_id ORDER BY p.created_at DESC')
  res.json(r.rows)
})

router.get('/posts/:id', async (req, res) => {
  const pool = req.app.locals.pool
  const id = Number(req.params.id)
  const r = await pool.query('SELECT p.*, u.name as author_name FROM forum_posts p LEFT JOIN users u ON u.id=p.author_id WHERE p.id=$1', [id])
  if (r.rowCount===0) return res.status(404).json({ message: 'Not found' })
  const post = r.rows[0]
  const comments = await pool.query('SELECT c.*, u.name as author_name FROM forum_comments c LEFT JOIN users u ON u.id=c.author_id WHERE c.post_id=$1 ORDER BY c.created_at', [id])
  post.comments = comments.rows
  res.json(post)
})

router.post('/posts', requireAuth, async (req, res) => {
  const pool = req.app.locals.pool
  const { title, content, anonymous } = req.body
  const user = req.user
  const r = await pool.query('INSERT INTO forum_posts (title,content,author_id,anonymous) VALUES ($1,$2,$3,$4) RETURNING *', [title,content,user.id,anonymous||false])
  res.json(r.rows[0])
})

router.post('/posts/:id/comments', requireAuth, async (req, res) => {
  const pool = req.app.locals.pool
  const id = Number(req.params.id)
  const { content } = req.body
  const user = req.user
  const r = await pool.query('INSERT INTO forum_comments (post_id,author_id,content) VALUES ($1,$2,$3) RETURNING *', [id,user.id,content])
  res.json(r.rows[0])
})

module.exports = router
