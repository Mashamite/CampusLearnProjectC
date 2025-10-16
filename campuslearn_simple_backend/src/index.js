require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./db/db') 

const authRoutes = require('./routes/auth')
const topicsRoutes = require('./routes/topics')
const forumRoutes = require('./routes/forum')
const messagesRoutes = require('./routes/messages')
const uploadRoutes = require('./routes/upload')
const notifyRoutes = require('./routes/notify')
const usersRoutes = require('./routes/users')
const aiRoutes = require('./routes/ai')
const faqRoutes = require('./routes/faqs')



const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: FRONTEND }))
app.use(express.json())


app.locals.pool = pool

app.get('/api/health', async (req, res) => {
  try {
    const r = await pool.query('SELECT NOW()')
    res.json({ status: 'ok', time: r.rows[0].now })
  } catch (e) {
    res.status(500).json({ status: 'error', error: e.message })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/topics', topicsRoutes)
app.use('/api/forum', forumRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/materials', uploadRoutes)
app.use('/api/notify', notifyRoutes)
app.use('/api/users', usersRoutes)
app.use("/api/ai", aiRoutes);
app.use('/api/faqs', faqRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
