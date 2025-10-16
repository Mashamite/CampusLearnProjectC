const { verify } = require('../lib/jwt')
module.exports = function requireAuth(req, res, next){
  const h = req.headers.authorization
  if (!h) return res.status(401).json({ message: 'Missing auth' })
  const parts = h.split(' ')
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid auth' })
  const payload = verify(parts[1])
  if (!payload) return res.status(401).json({ message: 'Invalid token' })
  req.user = payload
  next()
}
