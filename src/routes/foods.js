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
