const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const requireAuth = require('../middleware/auth')

router.post('/email', requireAuth, async (req, res) => {
  const { to_email, subject, message } = req.body
  const service_id = process.env.EMAILJS_SERVICE_ID
  const template_id = process.env.EMAILJS_TEMPLATE_ID
  const user_id = process.env.EMAILJS_USER_ID
  if (!service_id || !template_id || !user_id) return res.status(500).json({ message: 'EmailJS not configured' })

  const payload = {
    service_id,
    template_id,
    user_id,
    template_params: { to_email, subject, message }
  }

  try {
    const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!r.ok) {
      const t = await r.text()
      return res.status(500).json({ message: 'Email send failed', details: t })
    }
    res.json({ ok:true })
  } catch (e) {
    res.status(500).json({ message: 'Request failed', error: String(e) })
  }
})

module.exports = router
