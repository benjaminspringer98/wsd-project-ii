import * as answerService from "../../services/answerService.js";
import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const answerOptionValidationRules = {
  text: [validasaur.required, validasaur.minLength(1)],
};

const getAnswerOptionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  return {
    text: params.get("option_text"),
    isCorrect: params.get("is_correct") ? true : false,
  };
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
  const answerOptions = await answerService.findAnswerOptionsByQuestionId(
    questionId,
  );

  // prevent question from having multiple correct answers
  if (
    answerOptions.some((option) => option.is_correct) &&
    answerOptionData.isCorrect
  ) {
    render("question.eta", {
      ...answerOptionData,
      topic,
      question,
      answerOptions,
      validationErrors: {
        correctAnswer: { onlyOne: "Only one correct answer per question" },
      },
    });
    return;
  }

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
    await answerService.addAnswerOption(
      questionId,
      answerOptionData.text,
      answerOptionData.isCorrect,
    );

    response.redirect(`/topics/${topicId}/questions/${questionId}`);
  }
};

const deleteAnswerOption = async ({ params, response }) => {
  await answerService.deleteAnswerOptionById(params.oId);

  response.redirect(`/topics/${params.tId}/questions/${params.qId}`);
};

export { addAnswerOption, deleteAnswerOption };
