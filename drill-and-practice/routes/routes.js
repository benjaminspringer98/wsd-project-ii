import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as questionController from "./controllers/questionController.js";
import * as answerController from "./controllers/answerController.js";
import * as quizController from "./controllers/quizController.js";
import * as questionApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicController.list);
router.get("/topics/:id", topicController.view);
router.post("/topics", topicController.create);
router.post("/topics/:id/delete", topicController.remove);

router.post("/topics/:id/questions", questionController.create);
router.get("/topics/:tId/questions/:qId", questionController.view);
router.post(
  "/topics/:tId/questions/:qId/delete",
  questionController.remove,
);

router.post(
  "/topics/:tId/questions/:qId/options",
  answerController.addAnswerOption,
);
router.post(
  "/topics/:tId/questions/:qId/options/:oId/delete",
  answerController.deleteAnswerOption,
);

router.get("/quiz", quizController.listTopics);
router.get("/quiz/:tId", quizController.getRandomQuestion);
router.get("/quiz/:tId/questions/:qId", quizController.showQuestion);
router.post(
  "/quiz/:tId/questions/:qId/options/:oId",
  quizController.processAnswer,
);
router.get(
  "/quiz/:tId/questions/:qId/correct",
  quizController.correctAnswerProvided,
);
router.get(
  "/quiz/:tId/questions/:qId/incorrect",
  quizController.incorrectAnswerProvided,
);

router.get("/api/questions/random", questionApi.getRandomQuestion);
router.post("/api/questions/answer", questionApi.checkAnswer);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.login);
router.post("/auth/logout", loginController.logout);

export { router };
