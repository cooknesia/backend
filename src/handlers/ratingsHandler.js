const { addRating, checkRatingExists } = require('../models/ratingsModel');
const { checkFoodExists } = require('../models/foodsModel');
const { checkUserExists, isValidUUID } = require('../models/usersModel');
const { decodeJwt } = require('../utils/jwt');

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
    }

    const ratingExists = await checkRatingExists(userId, foodId);
    if (ratingExists) {
      return h
        .response({
          code: 400,
          status: 'error',
          message: 'User has already rated this food',
        })
        .code(400);
    }

    await addRating({ userId, foodId, rating });
    return h
      .response({
        code: 201,
        status: 'success',
        message: 'Rating saved successfully',
      })
      .code(201);
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

const getRatingHandler = async (request, h) => {
  try {
    const foodId = parseInt(request.params.foodId);
    const token = request.headers.authorization?.split(' ')[1];
    const userId = decodeJwt(token)?.id || null; 

    if (!token) {
      return h.response({
        status: false,
        message: 'Unauthorized',
      }).code(401);
    }

    if (!isValidUUID(userId)) {
      return h
        .response({
          code: 400,
          status: 'error',
          message: 'User ID must be a valid UUID',
        })
        .code(400);
    }

    const ratingExists = await checkRatingExists(userId, foodId);
    return h
      .response({
        status: true,
        user_has_rated: ratingExists
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        status: false,
        message: 'Failed to get rating',
      })
      .code(500);
  }
};

module.exports = { addRatingHandler,getRatingHandler };
