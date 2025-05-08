const ratingsModel = require('../models/ratingsModel');
const { checkFoodExists } = require('../models/foodModel');
const { checkUserExists, isValidUUID } = require('../models/usersModel');

const addRatingHandler = async (request, h) => {
  try {
    const { userId, rating } = request.payload;
    const foodId = parseInt(request.params.foodId);

    if (!isValidUUID(userId)) {
      return h
        .response({
          code: 400,
          status: 'error',
          message: 'User ID must be a valid UUID',
        })
        .code(400);
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return h
        .response({
          code: 400,
          status: 'error',
          message: 'Rating must be a number between 1 and 5',
        })
        .code(400);
    }

    const userExists = await checkUserExists(userId);
    if (!userExists) {
      return h
        .response({
          code: 404,
          status: 'error',
          message: 'User not found',
        })
        .code(404);
    }

    const food = await checkFoodExists(foodId);
    if (!food) {
      return h
        .response({
          code: 404,
          status: 'error',
          message: 'Food not found',
        })
        .code(404);
    } else {
      await ratingsModel.addOrUpdateRating({ userId, foodId, rating });
      return h
        .response({
          code: 201,
          status: 'success',
          message: 'Rating saved successfully',
        })
        .code(201);
    }
  } catch (err) {
    console.error(err);
      return h
        .response({
          code: 500,
          status: 'error',
          message: 'Failed to save rating',
        })
        .code(500);
  }
};

module.exports = { addRatingHandler };
