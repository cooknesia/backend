const jwt = require('jsonwebtoken');

const generateJwt = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return jwt.sign(payload, secret, {
    expiresIn: '1d',
  });
};


module.exports = { generateJwt };
