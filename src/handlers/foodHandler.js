const {
  getAllFoods,
  getFoodById,
  getPopularFoods,
  incrementClickCount,
  checkFoodExists,
} = require('../models/foodsModel');
const jwt = require('jsonwebtoken');
const { decodeJwt } = require('../utils/jwt');
const { checkRatingExists } = require('../models/ratingsModel');

const getFoodsHandler = async (request, h) => {
  try {
    const { keyword, province, page = 1, limit = 20 } = request.query;
    console.log(request.query);
    const offset = (page - 1) * limit;

    const { foods, total } = await getAllFoods(province, keyword, limit, offset);

    const totalPages = Math.ceil(total / limit);

    return h
      .response({
        code: 200,
        status: 'success',
        data: {
          foods,
          pagination: {
            total,
            totalPages,
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            beforePage: page > 1 ? page - 1 : null,
          },
        },
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        code: 500,
        status: 'error',
        message: 'Failed to retrieve food data',
      })
      .code(500);
  }
};

const getFoodHandler = async (request, h) => {
  const { foodId } = request.params;
  const token = request.headers.authorization?.split(' ')[1];
  const user = decodeJwt(token); 

  try {
    let user_has_rated = false;
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
      const food = await getFoodById(foodId);

      if (token && user) {
        user_has_rated = await checkRatingExists(user.id, foodId);
      }
      await incrementClickCount(foodId);
      console.log(user_has_rated)
      return h
        .response({
          code: 200,
          status: 'success',
          data: {
            user_has_rated,
            ...food,
          },
        })
        .code(200);
    }
  } catch (err) {
    console.error(err);
    return h
      .response({
        code: 500,
        status: 'error',
        message: 'Failed to retrieve food details',
      })
      .code(500);
  }
};

const getPopularFoodsHandler = async (request, h) => {
  try {
    const foods = await getPopularFoods();
    return h
      .response({
        code: 200,
        status: 'success',
        data: foods,
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        code: 500,
        status: 'error',
        message: 'Failed to retrieve popular foods',
      })
      .code(500);
  }
};



module.exports = {
  getFoodsHandler,
  getFoodHandler,
  getPopularFoodsHandler,
};
