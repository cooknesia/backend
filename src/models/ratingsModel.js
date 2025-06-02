const pool = require('../db/pool');

const checkRatingExists = async (userId, foodId) => {
  const res = await pool.query(
    `SELECT 1 FROM ratings WHERE user_id = $1 AND food_id = $2`,
    [userId, foodId]
  );
  return res.rowCount > 0;
};

const addRating = async ({ userId, foodId, rating }) => {
  const res = await pool.query(
    `INSERT INTO ratings (user_id, food_id, rating)
       VALUES ($1, $2, $3)
       RETURNING *`,
    [userId, foodId, rating],
  );
  return res.rows[0];
};

module.exports = { addRating, checkRatingExists };
