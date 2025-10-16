const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'devsecret'
module.exports.sign = (payload, expires='7d') => jwt.sign(payload, SECRET, { expiresIn: expires })
module.exports.verify = (token) => {
  try { return jwt.verify(token, SECRET) } catch(e) { return null }
}
