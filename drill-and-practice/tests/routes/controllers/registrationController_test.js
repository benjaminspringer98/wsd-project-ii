import { superoak } from "../../../deps.js";
import { app } from "../../../app.js";

Deno.test("User can register", async () => {
  const testClient = await superoak(app);
  await testClient.post("/auth/register")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .send("email=test@test.net&password=test123")
    .expect(302);
});
