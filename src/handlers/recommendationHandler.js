const recommendationModel = require('../models/recommendationModel');
const foodsModel = require('../models/foodsModel');

const recommendFoodHandler = async (request, h) => {
  try {
    const { ingredients } = request.payload;
    const userId = request.query.userId;

    const recommendedFoods = await recommendationModel.getRecommendationFromML(ingredients);

    if (!recommendedFoods || recommendedFoods.length === 0) {
      return h.response({
        code: 200,
        status: 'success',
        data: [],
      }).code(200);
    }

    const recommendedFoodIds = recommendedFoods.map(food => food.id);

    if (userId) {
      await recommendationModel.logRecommendation({
        userId,
        ingredients,
        foodIds: recommendedFoodIds,
      });
    }

    return h.response({
      code: 200,
      status: 'success',
      data: recommendedFoods,
    }).code(200);

  } catch (err) {
    console.error(err);
    const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
    return h.response({
      code: statusCode,
      status: 'error',
      message: 'Failed to get food recommendations',
    }).code(statusCode);
  }
};

const getRecommendationLogsHandler = async (request, h) => {
  try {
    const { userId } = request.params;
    const logs = await recommendationModel.getRecommendationLogsWithFoodsByUserId(userId);

    return h.response({
      code: 200,
      status: 'success',
      data: logs,
    }).code(200);

  } catch (err) {
    console.error(err);
    return h.response({
      code: 500,
      status: 'error',
      message: 'Failed to fetch recommendation log data',
    }).code(500);
  }
};

module.exports = {
  recommendFoodHandler,
  getRecommendationLogsHandler,
};
