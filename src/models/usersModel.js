const pool = require('../db/pool');

const getUserByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

const createUser = async ({ email, name, photo_url }) => {
  const res = await pool.query(
    'INSERT INTO users (email, name, photo_url) VALUES ($1, $2, $3) RETURNING *',
    [email, name, photo_url],
  );
  return res.rows[0];
};

const checkUserExists = async (userId) => {
  const res = await pool.query('SELECT 1 FROM users WHERE id = $1', [userId]);
  return res.rowCount > 0;
};

const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

module.exports = { getUserByEmail, createUser, checkUserExists, isValidUUID };
