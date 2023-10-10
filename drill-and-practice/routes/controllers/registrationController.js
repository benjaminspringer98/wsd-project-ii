import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";
import { validasaur } from "../../deps.js";

const authPath = "/auth";

const userValidationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

const getUserData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    email: params.get("email"),
    password: params.get("password"),
  };
};

const registerUser = async ({ request, response, render }) => {
  const userData = await getUserData(request);

  const [passes, errors] = await validasaur.validate(
    userData,
    userValidationRules,
  );

  if (!passes) {
    console.log(errors);
    userData.validationErrors = errors;

    //only return email and validationErrors, not the password
    render(`${authPath}/registration.eta`, {
      email: userData.email,
      validationErrors: userData.validationErrors,
    });
  } else {
    try {
      await userService.create(
        userData.email,
        await bcrypt.hash(userData.password),
      );
      response.redirect("/auth/login");
    } catch (error) { // if email already in use
      console.log(error);
      render(`${authPath}/registration.eta`, {
        email: userData.email,
        validationErrors: { email: { unique: "Email already in use" } },
      });
    }
  }
};

const showRegistrationForm = ({ render }) => {
  render(`${authPath}/registration.eta`);
};

export { registerUser, showRegistrationForm };
