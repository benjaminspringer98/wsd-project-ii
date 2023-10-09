import { sql } from "../database/database.js";

const findAnswerOptionsByQuestionId = async (questionId) => {
  return await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
};

const addAnswerOption = async (questionId, text, isCorrect) => {
  await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${questionId}, ${text}, ${isCorrect})`;
};

const deleteAnswerOptionById = async (answerOptionId) => {
  await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${answerOptionId}`;
  await sql`DELETE FROM question_answer_options WHERE id = ${answerOptionId}`;
};

const deleteAnswerOptionsByQuestionId = async (questionId) => {
  // first delete answers
  await sql`DELETE FROM question_answers WHERE question_id = ${questionId}`;
  // then delete answer options
  await sql`DELETE FROM question_answer_options WHERE question_id = ${questionId}`;
};

const deleteAnswerOptionsByTopicId = async (topicId) => {
  // delete answers
  await sql`DELETE FROM question_answers WHERE question_id IN (SELECT id FROM questions WHERE topic_id = ${topicId})`;
  // delete answer options
  await sql`DELETE FROM question_answer_options WHERE question_id IN (SELECT id FROM questions WHERE topic_id = ${topicId})`;
};

const recordAnswer = async (userId, questionId, questionAnswerOptionId) => {
  await sql`INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES (${userId}, ${questionId}, ${questionAnswerOptionId})`;
};

const findAnswerOptionById = async (id) => {
  const rows =
    await sql`SELECT * FROM question_answer_options WHERE id = ${id}`;

  if (rows && rows.length > 0) {
    return rows[0];
  }

  return false;
};

const findCorrectOptionByQuestionId = async (questionId) => {
  const rows =
    await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId} AND is_correct = true`;

  if (rows && rows.length > 0) {
    return rows[0];
  }

  return false;
};

const getAnswersCount = async () => {
  const rows = await sql`SELECT COUNT(*) FROM question_answers`;
  return Number(rows[0].count);
};

export {
  addAnswerOption,
  deleteAnswerOptionById,
  deleteAnswerOptionsByQuestionId,
  deleteAnswerOptionsByTopicId,
  findAnswerOptionById,
  findAnswerOptionsByQuestionId,
  findCorrectOptionByQuestionId,
  getAnswersCount,
  recordAnswer,
};
