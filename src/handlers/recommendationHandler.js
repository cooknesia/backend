const recommendationModel = require('../models/recommendationModel');
const foodsModel = require('../models/foodsModel');

const recommendFoodHandler = async (request, h) => {
  try {
    const { ingredients } = request.payload;
    const userId = request.auth.credentials.user_id;

    const recommendedFoodIds = await recommendationModel.getRecommendationFromML(ingredients);

    const recommendedFoods = await foodsModel.getFoodsByIds(recommendedFoodIds);

    await recommendationModel.logRecommendation({
      userId,
      ingredients,
      foodIds: recommendedFoodIds,
    });

    return h.response({
      code: 200,
      status: 'success',
      data: recommendedFoods,  // Sudah berupa list food lengkap
    }).code(200);

  } catch (err) {
    console.error(err);
    return h.response({
      code: 500,
      status: 'error',
      message: 'Gagal mendapatkan rekomendasi makanan',
    }).code(500);
  }
};

module.exports = {
  recommendFoodHandler,
};