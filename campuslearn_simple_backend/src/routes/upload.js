const express = require('express')
const router = express.Router()
const multer = require('multer')
const requireAuth = require('../middleware/auth')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir) },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname) }
})
const upload = multer({ storage })

router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  const pool = req.app.locals.pool
  const { title } = req.body
  const file = req.file
  if (!file) return res.status(400).json({ message: 'No file' })
  const url = '/uploads/' + file.filename
  
  const r = await pool.query('INSERT INTO materials (topic_id,title,type,url) VALUES ($1,$2,$3,$4) RETURNING *', [null, title, file.mimetype, url])
  res.json({ ok:true, material: r.rows[0] })
})

module.exports = router
