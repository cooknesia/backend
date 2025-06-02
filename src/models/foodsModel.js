const pool = require('../db/pool');

const getAllFoods = async (province, keyword, limit, offset) => {
  let query = `
    SELECT 
      f.*, 
      COALESCE(AVG(r.rating), 0)::FLOAT AS average_rating,
      COUNT(*) OVER() AS total_count
    FROM foods f
    LEFT JOIN ratings r ON f.id = r.food_id
  `;
  const conditions = [];
  const params = [];

  if (province) {
    params.push(province);
    conditions.push(`f.province_id = $${params.length}`);
  }

  if (keyword) {
    params.push(`%${keyword}%`);
    conditions.push(`f.name ILIKE $${params.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += `
    GROUP BY f.id
    ORDER BY f.name ASC
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

  params.push(limit, offset);

  const result = await pool.query(query, params);

  const foods = result.rows;
  const total = foods.length > 0 ? parseInt(foods[0].total_count, 10) : 0;

  return { foods, total };
};

const getFoodById = async (id) => {
  const foodRes = await pool.query(
    `SELECT f.*, COALESCE(AVG(r.rating), 0)::FLOAT AS average_rating
     FROM foods f
     LEFT JOIN ratings r ON f.id = r.food_id
     WHERE f.id = $1
     GROUP BY f.id`,
    [id],
  );

  const ingredientsRes = await pool.query(
    `SELECT i.name 
     FROM ingredients i
     JOIN food_ingredients fi ON fi.ingredient_id = i.id
     WHERE fi.food_id = $1`,
    [id],
  );

  const stepsRes = await pool.query(
    `SELECT step_order, description FROM cooking_steps
     WHERE food_id = $1
     ORDER BY step_order`,
    [id],
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
      LIMIT 12
    `);
  return res.rows;
};

const checkFoodExists = async (id) => {
  const res = await pool.query('SELECT 1 FROM foods WHERE id = $1', [id]);
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

module.exports = {
  getAllFoods,
  getFoodById,
  incrementClickCount,
  getPopularFoods,
  checkFoodExists,
  getFoodsByIds,
};
