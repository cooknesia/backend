const jwt = require('jsonwebtoken');

const authenticateJWT = (request, h) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return h.response({ message: 'Unauthorized: Token not found' }).code(401).takeover();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    request.auth = {
      credentials: decoded, 
    };

    return h.continue;
  } catch (error) {
    return h.response({ message: 'Unauthorized: Invalid token' }).code(401).takeover();
  }
};

module.exports = authenticateJWT;
