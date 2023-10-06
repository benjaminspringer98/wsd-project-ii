const { test, expect } = require("@playwright/test");

// main tests

test("User can register", async ({ page }) => {
  await register(page);
  await expect(page.locator("h1")).toHaveText("Login");
});

test("Registered user can login", async ({ page }) => {
  const { email, password } = await register(page);
  await login(email, password, page);
  await expect(page.locator("h2")).toHaveText("Available topics");
});

test("Unauthenticated user gets redirected to /auth/login", async ({ page }) => {
  await page.goto("/topics");
  await expect(page.locator("h1")).toHaveText("Login");
});

test("Authenticated user can view list of topics", async ({ page }) => {
  const { email, password } = await register(page);
  await login(email, password, page);

  await expect(page.locator("#topics li a")).toHaveText("Finnish language");
});

test("Authenticated user can create question", async ({ page }) => {
  const { email, password } = await register(page);
  await login(email, password, page);

  await page.goto("/topics");
  const topicName = "Finnish language";
  await page.locator(`#topics li >> text='${topicName}'`).click();
  const questionText = randomString(5);
  await page.locator("#question_text").type(questionText);
  await page.locator("#createQuestionBtn").click();

  await expect(page.locator(`#questions li a >> text='${questionText}'`))
    .toHaveText(
      questionText,
    );
});

test("Authenticated user can view created question", async ({ page }) => {
  const { email, password } = await register(page);
  await login(email, password, page);

  await page.goto("/topics");
  const topicName = "Finnish language";
  await page.locator(`#topics li >> text='${topicName}'`).click();
  const questionText = randomString(5);
  await page.locator("#question_text").type(questionText);
  await page.locator("#createQuestionBtn").click();
  await page.locator(`#questions li a >> text='${questionText}'`).click();

  await expect(page.locator("h2")).toHaveText(questionText);
});

test("Authenticated user can delete question with no answer options", async ({ page }) => {
  const { email, password } = await register(page);
  await login(email, password, page);

  await page.goto("/topics");
  const topicName = "Finnish language";
  await page.locator(`#topics li >> text='${topicName}'`).click();
  const questionText = randomString(5);
  await page.locator("#question_text").type(questionText);
  await page.locator("#createQuestionBtn").click();
  await page.locator(`#questions li a >> text='${questionText}'`).click();

  await page.locator("#deleteQuestionBtn").click();
  await expect(page.locator(`#questions li a >> text='${questionText}'`))
    .toHaveCount(0);
});

test("Authenticated user can create question answer option", async ({ page }) => {
  const { email, password } = await register(page);
  await login(email, password, page);

  await page.goto("/topics");
  const topicName = "Finnish language";
  await page.locator(`#topics li >> text='${topicName}'`).click();
  const questionText = randomString(5);
  await page.locator("#question_text").type(questionText);
  await page.locator("#createQuestionBtn").click();
  await page.locator(`#questions li a >> text='${questionText}'`).click();

  const answerOptionText = randomString(10);
  await page.locator("#option_text").type(answerOptionText);
  await page.locator("#addAnswerOptionBtn").click();
  await expect(
    page.locator(`#answerOptions tr td >> text='${answerOptionText}'`),
  )
    .toHaveText(
      answerOptionText,
    );
});

test("Authenticated user can delete question answer option", async ({ page }) => {
  const { email, password } = await register(page);
  await login(email, password, page);

  await page.goto("/topics");
  const topicName = "Finnish language";
  await page.locator(`#topics li >> text='${topicName}'`).click();
  const questionText = randomString(5);
  await page.locator("#question_text").type(questionText);
  await page.locator("#createQuestionBtn").click();
  await page.locator(`#questions li a >> text='${questionText}'`).click();

  const answerOptionText = randomString(10);
  await page.locator("#option_text").type(answerOptionText);
  await page.locator("#addAnswerOptionBtn").click();

  await page.locator("#deleteAnswerOptionBtn").click();
  await expect(
    page.locator(`#answerOptions tr td >> text='${answerOptionText}'`),
  )
    .toHaveCount(0);
});

// TODO: Admin can create and delete topic? is it bad to hard code admin
// credentials here?

// helper functions

const register = async (page) => {
  await page.goto("/auth/register");
  const email = `${randomString(6)}@test.com`;
  const password = randomString(6);
  await page.locator("#email").type(email);
  await page.locator("#password").type(password);
  await page.locator("#registerBtn").click();

  return {
    email: email,
    password: password,
  };
};

const login = async (email, password, page) => {
  await page.goto("/auth/login");
  await page.locator("#email").type(email);
  await page.locator("#password").type(password);
  await page.locator("#loginBtn").click();

  await page.goto("/topics");
};

const randomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
