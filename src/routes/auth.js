const authHandler = require('../handlers/authHandler');

module.exports = {
  name: 'auth-routes',
  register: async function (server, options) {
    server.route([
      {
        method: 'POST',
        path: '/api/v1/auth/google',
        handler: authHandler.loginWithGoogle,
      },
    ]);
  },
};