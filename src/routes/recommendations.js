const ratingsHandler = require('../handlers/recommendationHandler');
const authenticateJWT = require('../middlewares/authMiddleware');

module.exports = {
  name: 'recommendations-routes',
  register: async function (server) {
    server.route([
      {
        method: 'POST',
        path: '/api/v1/recomemmendations',
        handler: ratingsHandler.addRatingHandler,
        options: {
          pre: [{ method: authenticateJWT }],
        },
      },
    ]);
  },
};
