import { Application } from "./deps.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { userMiddleware } from "./middlewares/userMiddleware.js";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { Session } from "./deps.js";
import { router } from "./routes/routes.js";
import { oakCors } from "./deps.js";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";

const app = new Application();
app.use(Session.initMiddleware());

app.use(errorMiddleware);
app.use(oakCors());
app.use(authMiddleware);
app.use(userMiddleware);
app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(router.routes());

Deno.test("GET request to /api/questions/random returns random question json", async () => {
  const testClient = await superoak(app);
  await testClient.get("/api/questions/random")
    .expect(200)
    .expect("Content-Type", new RegExp("application/json"));
});

export { app };
