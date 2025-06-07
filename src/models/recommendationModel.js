const axios = require('axios');
const pool = require('../db/pool');
require('dotenv').config();

const getRecommendationFromML = async (ingredients) => {
  console.log('ingredients in model', ingredients);
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    const error = new Error("Please enter 'ingredients' in the form of a list of ingredients");
    error.statusCode = 400;
    throw error;
  }

  try {
    const res = await axios.post(process.env.MODEL_URL, {
      ingredients,
    });

    if (res.status !== 200) {
      const error = new Error(res.data.message || 'Error from model endpoint');
      error.statusCode = res.status;
      throw error;
    }

    const recommendedFoodIds = res.data.data.map((item) => item.food_id);
    console.log(recommendedFoodIds);

    // Validate recommendedFoodIds against database
    const queryValidate = 'SELECT id FROM foods WHERE id = ANY($1)';
    const resultValidate = await pool.query(queryValidate, [recommendedFoodIds]);
    const validFoodIds = resultValidate.rows.map((row) => row.id);

    if (validFoodIds.length === 0) {
      return [];
    }

    // Fetch full food data for validFoodIds
    const queryFetch = `
      SELECT f.*, COALESCE(AVG(r.rating), 0)::FLOAT AS average_rating
      FROM foods f
      LEFT JOIN ratings r ON f.id = r.food_id
      WHERE f.id = ANY($1)
      GROUP BY f.id
    `;
    const resultFetch = await pool.query(queryFetch, [validFoodIds]);
    return resultFetch.rows;
  } catch (err) {
    const error = new Error(
      err.response?.data?.message || err.message || 'Failed to get recommendation from model',
    );
    error.statusCode = err.response?.status || 500;
    throw error;
  }
};

const logRecommendation = async ({ userId, ingredients, foodIds }) => {
  const result = await pool.query(
    `INSERT INTO recommendation_logs (user_id, selected_ingredients, recommended_foods)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, ingredients, foodIds],
  );
  return result.rows[0];
};

const getRecommendationLogsWithFoodsByUserId = async (userId) => {
  // Query recommendation logs unik berdasarkan kombinasi selected_ingredients,
  // pilih yang terbaru per kombinasi
  const logsRes = await pool.query(
    `
    SELECT DISTINCT ON (normalized_ingredients)
      id,
      user_id,
      selected_ingredients,
      recommended_foods,
      created_at
    FROM (
      SELECT *,
        ARRAY(
          SELECT DISTINCT ingredient
          FROM unnest(selected_ingredients) AS ingredient
          ORDER BY ingredient
        ) AS normalized_ingredients
      FROM recommendation_logs
      WHERE user_id = $1
    ) sub
    ORDER BY normalized_ingredients, created_at DESC
    `,
    [userId]
  );

  let logs = logsRes.rows;

  // Urutkan logs berdasarkan id terbesar ke terkecil
  logs = logs.sort((a, b) => b.id - a.id);

  // Fetch detail foods untuk tiap log
  for (const log of logs) {
    if (log.recommended_foods && log.recommended_foods.length > 0) {
      const foodsRes = await pool.query(
        `
        SELECT f.*, COALESCE(AVG(r.rating), 0)::FLOAT AS average_rating
        FROM foods f
        LEFT JOIN ratings r ON f.id = r.food_id
        WHERE f.id = ANY($1)
        GROUP BY f.id
        `,
        [log.recommended_foods]
      );
      log.foods = foodsRes.rows;
    } else {
      log.foods = [];
    }
    delete log.recommended_foods;
  }

  return logs;
};



module.exports = {
  getRecommendationFromML,
  logRecommendation,
  getRecommendationLogsWithFoodsByUserId,
};
