import { sql } from "../database/database.js";

const create = async (userId, topicId, text) => {
  await sql`INSERT INTO questions (user_id, topic_id, question_text) VALUES (${userId}, ${topicId}, ${text})`;
};

const deleteQuestionById = async (questionId) => {
  await sql`DELETE FROM questions WHERE id = ${questionId}`;
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

const addAnswerOption = async (questionId, text, isCorrect) => {
  await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${questionId}, ${text}, ${isCorrect})`;
};

const findAnswerOptionsByQuestionId = async (questionId) => {
  return await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
};

const deleteAnswerOptionById = async (answerOptionId) => {
  await sql`DELETE FROM question_answer_options WHERE id = ${answerOptionId}`;
};

export {
  addAnswerOption,
  create,
  deleteAnswerOptionById,
  deleteQuestionById,
  findAllByTopicId,
  findAnswerOptionsByQuestionId,
  findById,
};
