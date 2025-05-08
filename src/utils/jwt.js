const jwt = require('jsonwebtoken');

const generateJwt = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

module.exports = { generateJwt };
