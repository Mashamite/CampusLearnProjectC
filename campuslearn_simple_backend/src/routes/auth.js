const express = require('express')
const router = express.Router()
const { sign } = require('../lib/jwt')


router.post('/register', async (req, res) => {
  const pool = req.app.locals.pool
  const { name, email, password } = req.body

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Missing fields' })

  try {
 
    const r = await pool.query(
      `INSERT INTO student (name, email, passwordhash, createdat)
       VALUES ($1, $2, $3, NOW())
       RETURNING studentid, name, email`,
      [name, email, password]
    )

    const user = r.rows[0]

    const token = sign({ id: user.studentid, email: user.email, role: 'student' })

    res.json({ token, user: { id: user.studentid, name: user.name, email: user.email, role: 'student' } })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})


router.post('/login', async (req, res) => {
  const pool = req.app.locals.pool
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ message: 'Missing fields' })

  try {
    const r = await pool.query(
      `SELECT studentid, name, email, passwordhash
       FROM student
       WHERE email = $1`,
      [email]
    )

    if (r.rowCount === 0)
      return res.status(401).json({ message: 'Invalid credentials' })

    const user = r.rows[0]

    
    if (user.passwordhash !== password)
      return res.status(401).json({ message: 'Invalid credentials' })

   
    const token = sign({ id: user.studentid, email: user.email, role: 'student' })

    res.json({ token, user: { id: user.studentid, name: user.name, email: user.email, role: 'student' } })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

module.exports = router
