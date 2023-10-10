import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const showMain = async ({ render }) => {
  render("main.eta", {
    topicCount: await topicService.getCount(),
    questionCount: await questionService.getCount(),
    answerCount: await answerService.getAnswersCount(),
  });
};

export { showMain };
