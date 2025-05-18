const { getAllFoods, getFoodById, getPopularFoods, incrementClickCount,  checkFoodExists, checkProvinceExists,  searchFoods } = require('../models/foodsModel');

const getFoodsHandler = async (request, h) => {
  try {
    const { provinceId } = request.params;
    const page = parseInt(request.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    if (provinceId) {
      const provinceExists = await checkProvinceExists(provinceId);
      if (!provinceExists) {
        return h.response({
          code: 404,
          status: 'not found',
          message: 'Province not found',
        }).code(404);
      }
    }

    const foods = await getAllFoods(provinceId, limit, offset);
    return h.response({
      code: 200,
      status: 'success', 
      data:{
        page,
        foods,
        count: foods.length,
      } ,
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


const getFoodHandler = async (request, h) => {
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

const searchFoodsHandler = async (request, h) => {
  try {
    const { keyword } = request.query;
    if (!keyword) {
      return h.response({
        code: 400,
        status: 'error', 
        message: 'Keyword query parameter is required' }).code(400);
    }
    const foods = await searchFoods(keyword);
    return h.response(
      { code: 200, 
        status: 'success', 
        data: foods
      }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ 
      code: 500,
      status: 'error',
      message: 'Failed to search foods' }).code(500);
  }
};

module.exports = {
  getFoodsHandler,
  getFoodHandler,
  getPopularFoodsHandler,
  searchFoodsHandler,
};
