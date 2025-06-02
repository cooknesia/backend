const { getAllIngredients, searchIngredients } = require('../models/ingredientsModel');

const getAllIngredientsHandler = async (request, h) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const ingredients = await getAllIngredients(page);
    return h
      .response({
        code: 200,
        status: 'success',
        data: {
          page,
          ingredients,
          count: ingredients.length,
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        code: 500,
        status: 'error',
        message: 'Failed to fetch ingredients',
      })
      .code(500);
  }
};

const searchIngredientsHandler = async (request, h) => {
  try {
    const { keyword } = request.query;
    if (!keyword) {
      return h.response({ error: 'Keyword query parameter is required' }).code(400);
    }
    const ingredients = await searchIngredients(keyword);
    return h
      .response({
        code: 200,
        status: 'success',
        data: ingredients,
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        code: 500,
        status: 'error',
        message: 'Failed to search ingredients',
      })
      .code(500);
  }
};

module.exports = { getAllIngredientsHandler, searchIngredientsHandler };
