import * as questionService from "../../services/questionService.js";
import * as topicService from "../../services/topicService.js";
import * as answerService from "../../services/answerService.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
  text: [validasaur.required, validasaur.minLength(1)],
};

const getQuestionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    text: params.get("question_text"),
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
    answerOptions: await answerService.findAnswerOptionsByQuestionId(
      params.qId,
    ),
  });
};

const remove = async ({ params, response }) => {
  const answerOptions = await answerService.findAnswerOptionsByQuestionId(
    params.qId,
  );

  if (answerOptions.length === 0) {
    await questionService.deleteById(params.qId);
    response.redirect(`/topics/${params.tId}`);
  } else {
    response.status = 400;
  }
};

export { create, remove, view };
