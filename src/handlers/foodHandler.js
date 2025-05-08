const { getAllFoods, getFoodById, getPopularFoods, incrementClickCount,  checkFoodExists, checkProvinceExists } = require('../models/foodModel');

const getFoods = async (request, h) => {
  try {
    const  { provinceId } = request.params;

    if (provinceId) {
      const provinceExists = await checkProvinceExists(provinceId);
      if (!provinceExists) {
      return h.response({
        code: 400,
        status: 'error',
        message: 'Province not found',
      }).code(400);
      }
    }

    const foods = await getAllFoods(provinceId);
    return h.response({
      code: 200,
      status: 'success',
      data: foods,
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      code: 500,
      status: 'error',
      message: 'Failed to retrieve food data',
    }).code(500);
  }
};

const getFood = async (request, h) => {
  const { foodId } = request.params;
  try {
   
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
      await incrementClickCount(foodId);
      return h
        .response({
          code: 200,
          status: 'success',
          data: food,
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
  getFoods,
  getFood,
  getPopularFoodsHandler,
};
