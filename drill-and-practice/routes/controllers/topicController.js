import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";

const topicValidationRules = {
  name: [validasaur.required, validasaur.minLength(1)],
};

const getTopicData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    name: params.get("name"),
  };
};

const create = async ({ request, response, render, user }) => {
  if (!user.isAdmin) {
    response.status = 403;
    return;
  }

  const topicData = await getTopicData(request);

  const [passes, errors] = await validasaur.validate(
    topicData,
    topicValidationRules,
  );

  // Always include the list of topics, whether there are errors or not
  const topics = await topicService.findAll();

  if (!passes) {
    console.log(errors);
    topicData.validationErrors = errors;

    render("topics.eta", {
      ...topicData,
      topics,
    });
  } else {
    await topicService.create(
      user.id,
      topicData.name,
    );

    response.redirect("/topics");
  }
};

const list = async ({ render }) => {
  render("topics.eta", {
    topics: await topicService.findAll(),
  });
};

const remove = async ({ params, response, user }) => {
  if (!user.isAdmin) {
    response.status = 403;
    return;
  }
  await topicService.deleteById(params.id);

  response.redirect("/topics");
};

const view = async ({ params, render }) => {
  console.log({
    topic: await topicService.findById(params.id),
  });

  render("topic.eta", {
    topic: await topicService.findById(params.id),
  });
};

export { create, list, remove, view };
