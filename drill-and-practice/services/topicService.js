import { sql } from "../database/database.js";
import * as questionService from "./questionService.js";

const findAll = async () => {
  return await sql`SELECT * FROM topics ORDER BY name ASC`;
};

const findById = async (id) => {
  const rows = await sql`SELECT * FROM topics WHERE id = ${id}`;

  if (rows && rows.length > 0) {
    return rows[0];
  }

  return { id: 0, name: "Unknown" };
};

const create = async (userId, name) => {
  await sql`INSERT INTO topics (user_id, name) VALUES (${userId}, ${name})`;
};

const deleteById = async (id) => {
  await questionService.deleteMultipleByTopicId(id);
  // delete topic
  await sql`DELETE FROM topics WHERE id = ${id}`;
};

const getCount = async () => {
  const rows = await sql`SELECT COUNT(*) FROM topics`;
  return Number(rows[0].count);
};

export { create, deleteById, findAll, findById, getCount };
