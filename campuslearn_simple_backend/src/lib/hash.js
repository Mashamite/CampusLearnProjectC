const bcrypt = require('bcrypt')
module.exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}
module.exports.comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash)
}
