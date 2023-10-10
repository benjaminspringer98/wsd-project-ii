import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const quizPath = "/quiz";

const listTopics = async ({ render }) => {
  render(`${quizPath}/quizTopics.eta`, {
    topics: await topicService.findAll(),
  });
};

const getRandomQuestion = async ({ params, response, render }) => {
  const topicId = params.tId;
  const question = await questionService.getRandomForTopicId(topicId);

  if (!question) {
    render(`${quizPath}/quizTopics.eta`, {
      topics: await topicService.findAll(),
      message: "No questions in this topic",
    });
  } else {
    response.redirect(`/quiz/${topicId}/questions/${question.id}`);
  }
};

const showQuestion = async ({ params, render }) => {
  const questionId = params.qId;
  const question = await questionService.findById(questionId);
  const answerOptions = await answerService.findAnswerOptionsByQuestionId(
    questionId,
  );

  render(`${quizPath}/quizQuestion.eta`, {
    question: question,
    topicId: params.tId,
    answerOptions: answerOptions,
  });
};

const processAnswer = async ({ params, response, user }) => {
  await answerService.recordAnswer(user.id, params.qId, params.oId);
  const chosenOption = await answerService.findAnswerOptionById(params.oId);

  if (!chosenOption) {
    response.status = 400;
  }

  if (chosenOption.is_correct) {
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/correct`);
  } else {
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/incorrect`);
  }
};

const correctAnswerProvided = async ({ params, render }) => {
  await render(`${quizPath}/correctAnswer.eta`, {
    topicId: params.tId,
  });
};

const incorrectAnswerProvided = async ({ params, render }) => {
  await render(`${quizPath}/incorrectAnswer.eta`, {
    topicId: params.tId,
    correctAnswerOption: await answerService.findCorrectOptionByQuestionId(
      params.qId,
    ),
  });
};

export {
  correctAnswerProvided,
  getRandomQuestion,
  incorrectAnswerProvided,
  listTopics,
  processAnswer,
  showQuestion,
};
