import { sql } from "../database/database.js";

const create = async (email, password) => {
  await sql`INSERT INTO users
      (email, password, admin)
        VALUES (${email}, ${password}, false)`;
};

const findByEmail = async (email) => {
  const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
  return rows;
};

export { create, findByEmail };
