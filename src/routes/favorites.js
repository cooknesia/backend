const favoritesHandler = require('../handlers/favoritesHandler');
const authenticateJWT = require('../middlewares/authMiddleware');

module.exports = {
  name: 'favorites-routes',
  register: async function (server) {
    server.route([
      {
        method: 'POST',
        path: '/api/v1/favorites',
        handler: favoritesHandler.addFavoriteHandler,
        options: {
          pre: [{ method: authenticateJWT }],
        },
      },
      {
        method: 'DELETE',
        path: '/api/v1/favorites',
        handler: favoritesHandler.removeFavoriteHandler,
        options: {
          pre: [{ method: authenticateJWT }],
        },
      },
      {
        method: 'GET',
        path: '/api/v1/favorites/{userId}',
        handler: favoritesHandler.getFavoritesHandler,
        options: {
          pre: [{ method: authenticateJWT }],
        },
      },
    ]);
  },
};
