const Joi = require('joi');
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
          tags: ['api', 'Favorites'],
          description: 'Tambah resep ke favorit',
          validate: {
            payload: Joi.object({
              userId: Joi.string().required().description('ID pengguna'),
              recipeId: Joi.string().required().description('ID resep'),
            }),
          },
          response: {
            status: {
              201: Joi.object({
                message: Joi.string(),
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
      {
        method: 'DELETE',
        path: '/api/v1/favorites',
        handler: favoritesHandler.removeFavoriteHandler,
        options: {
          pre: [{ method: authenticateJWT }],
          tags: ['api', 'Favorites'],
          description: 'Hapus resep dari favorit',
          validate: {
            payload: Joi.object({
              userId: Joi.string().required().description('ID pengguna'),
              recipeId: Joi.string().required().description('ID resep'),
            }),
          },
          response: {
            status: {
              200: Joi.object({
                message: Joi.string(),
              }),
            },
          },
        },
      },
      {
        method: 'GET',
        path: '/api/v1/favorites/{userId}',
        handler: favoritesHandler.getFavoritesHandler,
        options: {
          pre: [{ method: authenticateJWT }],
          tags: ['api', 'Favorites'],
          description: 'Ambil daftar resep favorit pengguna',
          validate: {
            params: Joi.object({
              userId: Joi.string().required().description('ID pengguna'),
            }),
          },
          response: {
            status: {
              200: Joi.array().items(
                Joi.object({
                  recipeId: Joi.string(),
                  recipeName: Joi.string(),
                  // Tambahkan field sesuai data favorit kamu
                }),
              ),
            },
          },
        },
      },
    ]);
  },
};
