import * as questionService from "../../services/questionService.js";
import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
  text: [validasaur.required, validasaur.minLength(1)],
};

const answerOptionValidationRules = {
  text: [validasaur.required, validasaur.minLength(1)],
};

const getQuestionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    text: params.get("question_text"),
  };
};

const getAnswerOptionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    text: params.get("option_text"),
    isCorrect: params.get("is_correct") ? true : false,
  };
};

const create = async ({ params, request, response, render, user }) => {
  const questionData = await getQuestionData(request);
  const topicId = params.id;

  const [passes, errors] = await validasaur.validate(
    questionData,
    questionValidationRules,
  );

  const topic = await topicService.findById(topicId);
  const questions = await questionService.findAllByTopicId(topicId);

  if (!passes) {
    console.log(errors);
    questionData.validationErrors = errors;

    render("topic.eta", {
      ...questionData,
      topic,
      questions,
    });
  } else {
    await questionService.create(
      user.id,
      topicId,
      questionData.text,
    );

    response.redirect(`/topics/${topicId}`);
  }
};

const view = async ({ params, render }) => {
  console.log(params.tId);

  render("question.eta", {
    topic: await topicService.findById(params.tId),
    question: await questionService.findById(params.qId),
    answerOptions: await questionService.findAnswerOptionsByQuestionId(
      params.qId,
    ),
  });
};

const addAnswerOption = async ({ params, request, response, render }) => {
  const answerOptionData = await getAnswerOptionData(request);
  const topicId = params.tId;
  const questionId = params.qId;

  const [passes, errors] = await validasaur.validate(
    answerOptionData,
    answerOptionValidationRules,
  );

  const topic = await topicService.findById(topicId);
  const question = await questionService.findById(questionId);
  const answerOptions = await questionService.findAnswerOptionsByQuestionId(
    questionId,
  );

  if (!passes) {
    console.log(errors);
    answerOptionData.validationErrors = errors;

    render("question.eta", {
      ...answerOptionData,
      topic,
      question,
      answerOptions,
    });
  } else {
    await questionService.addAnswerOption(
      questionId,
      answerOptionData.text,
      answerOptionData.isCorrect,
    );

    response.redirect(`/topics/${topicId}/questions/${questionId}`);
  }
};

const deleteQuestion = async ({ params, response }) => {
  const hasAnswerOptions = questionService.findAnswerOptionsByQuestionId(
    params.qId,
  ).length != 0;

  if (!hasAnswerOptions) {
    await questionService.deleteQuestionById(params.qId);
    response.redirect(`/topics/${params.tId}`);
  } else {
    response.status = 400;
  }
};

const deleteAnswerOption = async ({ params, response }) => {
  await questionService.deleteAnswerOptionById(params.oId);

  response.redirect(`/topics/${params.tId}/questions/${params.qId}`);
};

export { addAnswerOption, create, deleteAnswerOption, deleteQuestion, view };
