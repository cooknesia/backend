const Joi = require('joi');
const foodHandler = require('../handlers/foodHandler');

module.exports = {
  name: 'food-routes',
  register: async function (server) {
    server.route([
      {
        method: 'GET',
        path: '/api/v1/foods',
        handler: foodHandler.getFoodsHandler,
        options: {
          validate: {
            query: Joi.object({
              keyword: Joi.string().optional(),
              province: Joi.number().integer().min(1).max(38).optional(),
              page: Joi.number().integer().min(1).default(1),
              limit: Joi.number().integer().min(1).max(100).default(20),
            }),
            failAction: (request, h, err) => {
              return h
                .response({
                  code: 400,
                  status: 'error',
                  error: err.message,
                })
                .takeover()
                .code(400);
            },
          },
        },
      },
      {
        method: 'GET',
        path: '/api/v1/foods/{foodId}',
        handler: foodHandler.getFoodHandler,
      },
      {
        method: 'GET',
        path: '/api/v1/foods/popular',
        handler: foodHandler.getPopularFoodsHandler,
      },
    ]);
  },
};
