const axios = require('axios');
const pool = require('../db/pool');

const getRecommendationFromML = async (ingredients) => {
  const res = await axios.post('http://localhost:5000/recommend', {
    ingredients,
  });
  return res.data.data;
};

const logRecommendation = async ({ userId, ingredients, foodIds }) => {
  const result = await pool.query(
    `INSERT INTO recommendation_logs (user_id, selected_ingredients, recommended_foods)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, ingredients, foodIds]
  );
  return result.rows[0];
};

module.exports = { getRecommendationFromML, logRecommendation };
