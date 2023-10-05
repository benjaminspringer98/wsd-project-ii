import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicController.list);
router.get("/topics/:id", topicController.view);
router.post("/topics", topicController.create);
router.post("/topics/:id/delete", topicController.remove);

export { router };
