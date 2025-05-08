const pool = require('../db/pool');
const addOrUpdateRating = async ({ userId, foodId, rating }) => {
  const res = await pool.query(
    `INSERT INTO ratings (user_id, food_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, food_id)
       DO UPDATE SET rating = $3
       RETURNING *`,
    [userId, foodId, rating],
  );
  return res.rows[0];
};

module.exports = { addOrUpdateRating };
