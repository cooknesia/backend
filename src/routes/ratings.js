const ratingsHandler = require('../handlers/ratingsHandler');
const authenticateJWT = require('../middlewares/authMiddleware');

module.exports = {
  name: 'ratings-routes',
  register: async function (server) {
    server.route([
      {
        method: 'POST',
        path: '/api/v1/ratings/{foodId}',
        handler: ratingsHandler.addRatingHandler,
        options: {
          pre: [{ method: authenticateJWT }],
        },
      },
    ]);
  },
};
