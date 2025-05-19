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
      },
      {
        method: 'GET',
        path: '/api/v1/foods/province/{provinceId}',
        handler: foodHandler.getFoodsHandler,
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
      {
        method: 'GET',
        path: '/api/v1/foods/search',
        handler: foodHandler.searchFoodsHandler,
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
