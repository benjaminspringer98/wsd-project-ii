import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicController.list);
router.get("/topics/:id", topicController.view);
router.post("/topics", topicController.create);
router.post("/topics/:id/delete", topicController.remove);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.login);
router.post("/auth/logout", loginController.logout);

export { router };
