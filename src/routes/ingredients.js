const Joi = require('joi');
const ingredientsHandler = require('../handlers/ingredientsHandler');

module.exports = {
  name: 'ingredients-routes',
  register: async function (server) {
    server.route([
      {
        method: 'GET',
        path: '/api/v1/ingredients',
        handler: ingredientsHandler.getAllIngredientsHandler,
      },
      {
        method: 'GET',
        path: '/api/v1/ingredients/search',
        handler: ingredientsHandler.searchIngredientsHandler,
        options: {
          validate: {
            query: Joi.object({
              keyword: Joi.string().required(),
            }),
            failAction: (request, h, err) => {
              return h.response({
                code:400,
                status: 'error',
                 error: err.message 
                }).takeover().code(400);
            },
          },
        },
      },
    ]);
  },
};
