const Joi = require('joi');
const authHandler = require('../handlers/authHandler');

module.exports = {
  name: 'auth-routes',
  register: async function (server, options) {
    server.route([
      {
        method: 'POST',
        path: '/api/v1/auth/google',
        handler: authHandler.loginWithGoogle,  
        options: {
          tags: ['api', 'Auth'],
          description: 'Login menggunakan akun Google',
          validate: {
            payload: Joi.object({
              idToken: Joi.string().required().description('ID Token dari Google OAuth'),
            }),
          },
          response: {
            status: {
              200: Joi.object({
                  status: Joi.string().valid('success').required(),
                  message: Joi.string().required(),
                token: Joi.string().description('JWT token'),
              }),
              400: Joi.object({
                statusCode: Joi.number(),
                error: Joi.string(),
                message: Joi.string(),
              }),
            },
          },
        },
      },
    ]);
  },
};
