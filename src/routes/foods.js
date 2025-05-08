const foodHandler = require('../handlers/foodHandler');
const authenticateJWT = require('../middlewares/authMiddleware');

module.exports = {
  name: 'food-routes',
  register: async function (server) {
    server.route([
      {
        method: 'GET',
        path: '/api/v1/foods',
        handler: foodHandler.getFoods,
        options: {
          pre: [{ method: authenticateJWT }],
        },
      },
      {
        method: 'GET',
        path: '/api/v1/foods/province/{provinceId}',
        handler: foodHandler.getFoods,
        options: {
          pre: [{ method: authenticateJWT }],
        },
      },
      {
        method: 'GET',
        path: '/api/v1/foods/{foodId}',
        handler: foodHandler.getFood,
        options: {
          pre: [{ method: authenticateJWT }],
        },
      },
      {
        method: 'GET',
        path: '/api/v1/foods/popular',
        handler: foodHandler.getPopularFoodsHandler,
        options: {
          pre: [{ method: authenticateJWT }],
        },
      },
    ]);
  },
};
