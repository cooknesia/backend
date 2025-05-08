const pool = require('../db/pool');

const addFavorite = async ({ userId, foodId }) => {
  const res = await pool.query(
    `INSERT INTO favorites (user_id, food_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, food_id) DO NOTHING
     RETURNING *`,
    [userId, foodId],
  );
  return res.rows[0];
};

const removeFavorite = async ({ userId, foodId }) => {
  await pool.query(`DELETE FROM favorites WHERE user_id = $1 AND food_id = $2`, [userId, foodId]);
};

const getUserFavorites = async (userId) => {
  const res = await pool.query(
    `SELECT f.*, p.name as province_name FROM foods f
     JOIN favorites fav ON f.id = fav.food_id
     LEFT JOIN provinces p ON f.province_id = p.id
     WHERE fav.user_id = $1`,
    [userId],
  );
  return res.rows;
};

module.exports = { addFavorite, removeFavorite, getUserFavorites };
