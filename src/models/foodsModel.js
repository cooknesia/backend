const pool = require('../db/pool');

const getAllFoods = async (provinceId, limit, offset) => {
  let query = 'SELECT * FROM foods';
  const params = [];
  if (provinceId) {
    params.push(provinceId);
    query += ` WHERE province_id = $${params.length}`;
  }
  query += ' ORDER BY name ASC';
  if (limit) {
    params.push(limit);
    query += ` LIMIT $${params.length}`;
  }
  if (offset) {
    params.push(offset);
    query += ` OFFSET $${params.length}`;
  }
  const result = await pool.query(query, params);
  return result.rows;
};


const getFoodById = async (id) => {
  const foodRes = await pool.query(
    `SELECT f.*, COALESCE(AVG(r.rating), 0)::FLOAT AS average_rating
     FROM foods f
     LEFT JOIN ratings r ON f.id = r.food_id
     WHERE f.id = $1
     GROUP BY f.id`,
    [id]
  );

  const ingredientsRes = await pool.query(
    `SELECT i.name 
     FROM ingredients i
     JOIN food_ingredients fi ON fi.ingredient_id = i.id
     WHERE fi.food_id = $1`,
    [id]
  );

  const stepsRes = await pool.query(
    `SELECT step_order, description FROM cooking_steps
     WHERE food_id = $1
     ORDER BY step_order`,
    [id]
  );

  return {
    ...foodRes.rows[0],
    ingredients: ingredientsRes.rows.map((i) => i.name),
    cooking_steps: stepsRes.rows,
  };
};


const incrementClickCount = async (id) => {
  await pool.query('UPDATE foods SET click_count = click_count + 1 WHERE id = $1', [id]);
};

const getPopularFoods = async () => {
  const res = await pool.query(`
      SELECT f.*, COALESCE(AVG(r.rating), 0)::FLOAT AS average_rating
      FROM foods f
      LEFT JOIN ratings r ON f.id = r.food_id
      GROUP BY f.id
      ORDER BY f.click_count DESC
      LIMIT 3
    `);
  return res.rows;
};

const checkFoodExists = async (id) => {
  const res = await pool.query('SELECT 1 FROM foods WHERE id = $1', [id]);
  return res.rowCount > 0;
};

const checkProvinceExists = async (provinceId) => {
  const res = await pool.query('SELECT 1 FROM provinces WHERE id = $1', [provinceId]);
  return res.rowCount > 0;
};


const getFoodsByIds = async (ids) => {
  const query = `
    SELECT f.*, COALESCE(AVG(r.rating), 0)::FLOAT AS average_rating
    FROM foods f
    LEFT JOIN ratings r ON f.id = r.food_id
    WHERE f.id = ANY($1)
    GROUP BY f.id
  `;

  const result = await pool.query(query, [ids]);
  return result.rows;
};
const searchFoods = async (keyword) => {
  const query = `
      SELECT f.*, COALESCE(AVG(r.rating), 0)::FLOAT AS average_rating
    FROM foods f
    LEFT JOIN ratings r ON f.id = r.food_id
    WHERE f.name ILIKE '%' || $1 || '%'
    GROUP BY f.id
    ORDER BY f.name ASC
    LIMIT 20
  `;
  const result = await pool.query(query, [keyword]);
  return result.rows;
};

module.exports = {  getAllFoods,
  getFoodById,
  incrementClickCount,
  getPopularFoods,
  checkFoodExists,
  checkProvinceExists,
   getFoodsByIds,
    searchFoods };
