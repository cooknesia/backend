const jwt = require('jsonwebtoken');

const generateJwt = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return jwt.sign(payload, secret, {
    expiresIn: '1d',
  });
}; 

const decodeJwt = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.error('Invalid JWT:', err.message);
    return null; 
  }
};

module.exports = { generateJwt, decodeJwt };
