import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const getRandomQuestion = async ({ response }) => {
  const question = await questionService.getRandom();
  if (!question) {
    response.body = {};
  }

  const answerOptions = await answerService.findAnswerOptionsByQuestionId(
    question.id,
  );

  const newKeys = { id: "optionId", option_text: "optionText" };
  for (let i = 0; i < answerOptions.length; i++) {
    delete answerOptions[i].question_id;
    delete answerOptions[i].is_correct;
    answerOptions[i] = renameKeys(answerOptions[i], newKeys);
  }

  response.body = {
    questionId: question.id,
    questionText: question.question_text,
    answerOptions: answerOptions,
  };
};

const checkAnswer = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;

  console.log(`received data: ${document}`);

  if (!document.questionId || !document.optionId) {
    response.status = 400;
    return;
  }

  const correctOption = await answerService.findCorrectOptionByQuestionId(
    document.questionId,
  );

  const isCorrect = correctOption.id === document.optionId;
  response.body = {
    correct: isCorrect,
  };
};

const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};

export { checkAnswer, getRandomQuestion };
