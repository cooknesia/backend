const pool = require('../db/pool');

const getAllIngredients = async (page = 1) => {
  const limit = 20;
  const offset = (page - 1) * limit;
  const query = 'SELECT * FROM normal_ingredients LIMIT $1 OFFSET $2';
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

const searchIngredients = async (keyword) => {
  const query = `
    SELECT * FROM normal_ingredients
    WHERE name ILIKE '%' || $1 || '%'
    ORDER BY name ASC
    LIMIT 20
  `;
  const result = await pool.query(query, [keyword]);
  return result.rows;
};

module.exports = { getAllIngredients, searchIngredients };
