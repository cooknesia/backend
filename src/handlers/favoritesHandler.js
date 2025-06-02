const favoritesModel = require('../models/favoritesModel');
const usersModel = require('../models/usersModel');
const foodsModel = require('../models/foodsModel');

const addFavoriteHandler = async (request, h) => {
  try {
    const userId = request.query.userId;
    const foodId = parseInt(request.query.foodId);

    // Validate userId format
    if (!usersModel.isValidUUID(userId)) {
      return h
        .response({
          code: 400,
          status: 'fail',
          message: 'Invalid userId format',
        })
        .code(400);
    }

    // Validate userId existence
    const userExists = await usersModel.checkUserExists(userId);
    if (!userExists) {
      return h
        .response({
          code: 404,
          status: 'not found',
          message: 'User not found',
        })
        .code(404);
    }

    // Validate foodId existence
    const foodExists = await foodsModel.checkFoodExists(foodId);
    if (!foodExists) {
      return h
        .response({
          code: 404,
          status: 'not found',
          message: 'Food not found',
        })
        .code(404);
    }

    const result = await favoritesModel.addFavorite({ userId, foodId });
    return h
      .response({
        code: 201,
        status: 'success',
        message: 'Successfully added to favorites',
        data: result,
      })
      .code(201);
  } catch (err) {
    console.error(err);
    return h
      .response({
        code: 500,
        status: 'error',
        message: 'Failed to add to favorites',
      })
      .code(500);
  }
};

const removeFavoriteHandler = async (request, h) => {
  try {
    const userId = request.query.userId;
    const foodId = parseInt(request.query.foodId);

    // Validate userId format
    if (!usersModel.isValidUUID(userId)) {
      return h
        .response({
          code: 400,
          status: 'fail',
          message: 'Invalid userId format',
        })
        .code(400);
    }

    // Validate userId existence
    const userExists = await usersModel.checkUserExists(userId);
    if (!userExists) {
      return h
        .response({
          code: 404,
          status: 'not found',
          message: 'User not found',
        })
        .code(404);
    }

    // Validate foodId existence
    const foodExists = await favoritesModel.checkFavoriteExists({ userId, foodId });
    if (!foodExists) {
      return h
        .response({
          code: 404,
          status: 'not found',
          message: 'Food not found',
        })
        .code(404);
    }

    await favoritesModel.removeFavorite({ userId, foodId });
    return h
      .response({
        code: 200,
        status: 'success',
        message: 'Successfully removed from favorites',
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        code: 500,
        status: 'error',
        message: 'Failed to remove from favorites',
      })
      .code(500);
  }
};

const getFavoritesHandler = async (request, h) => {
  try {
    const userId = request.params.userId;

    // Validate userId format
    if (!usersModel.isValidUUID(userId)) {
      return h
        .response({
          code: 400,
          status: 'fail',
          message: 'Invalid userId format',
        })
        .code(400);
    }

    // Validate userId existence
    const userExists = await usersModel.checkUserExists(userId);
    if (!userExists) {
      return h
        .response({
          code: 400,
          status: 'fail',
          message: 'User not found',
        })
        .code(400);
    }

    const favorites = await favoritesModel.getUserFavorites(userId);
    return h
      .response({
        code: 200,
        status: 'success',
        data: favorites,
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        code: 500,
        status: 'error',
        message: 'Failed to retrieve favorites',
      })
      .code(500);
  }
};

module.exports = {
  addFavoriteHandler,
  removeFavoriteHandler,
  getFavoritesHandler,
};
