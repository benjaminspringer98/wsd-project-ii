import { sql } from "../database/database.js";
import * as answerService from "./answerService.js";

const create = async (userId, topicId, text) => {
  await sql`INSERT INTO questions (user_id, topic_id, question_text) VALUES (${userId}, ${topicId}, ${text})`;
};

const deleteById = async (questionId) => {
  await answerService.deleteAnswerOptionsByQuestionId(questionId);
  await sql`DELETE FROM questions WHERE id = ${questionId}`;
};

const deleteMultipleByTopicId = async (topicId) => {
  await answerService.deleteAnswerOptionsByTopicId(topicId);
  //delete questions
  await sql`DELETE FROM questions WHERE topic_id = ${topicId}`;
};

const findAllByTopicId = async (topicId) => {
  return await sql`SELECT * FROM questions WHERE topic_id = ${topicId};`;
};

const findById = async (id) => {
  const rows = await sql`SELECT * FROM questions WHERE id = ${id}`;

  if (rows && rows.length > 0) {
    return rows[0];
  }

  return { id: 0, question_text: "Unknown" };
};

const getRandomForTopicId = async (topicId) => {
  const rows =
    await sql` SELECT * FROM questions WHERE topic_id = ${topicId} ORDER BY random() LIMIT 1`;

  if (rows && rows.length > 0) {
    return rows[0];
  }

  return false;
};

const getRandom = async () => {
  const rows = await sql` SELECT * FROM questions ORDER BY random() LIMIT 1`;

  if (rows && rows.length > 0) {
    return rows[0];
  }

  return false;
};

const getCount = async () => {
  const rows = await sql`SELECT COUNT(*) FROM questions`;
  return Number(rows[0].count);
};

export {
  create,
  deleteById,
  deleteMultipleByTopicId,
  findAllByTopicId,
  findById,
  getCount,
  getRandom,
  getRandomForTopicId,
};
