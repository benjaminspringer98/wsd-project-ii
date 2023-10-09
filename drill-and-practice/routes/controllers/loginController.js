import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const login = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  const email = params.get("email");
  const password = params.get("password");

  const loginFailedMessage = "Login failed, invalid email or password.";

  if (!email || !password) {
    render("login.eta");
    return;
  }

  const userFromDatabase = await userService.findByEmail(
    email,
  );
  if (userFromDatabase.length != 1) {
    render("login.eta", { loginFailedMessage: loginFailedMessage });
    return;
  }

  const user = userFromDatabase[0];
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordCorrect) {
    render("login.eta", { loginFailedMessage: loginFailedMessage });
    return;
  }

  //shouldn't store password in session, even if hashed
  const sessionUser = { id: user.id, email: user.email, isAdmin: user.admin };
  await state.session.set("user", sessionUser);
  response.redirect("/topics");
};

const logout = async ({ response, state }) => {
  await state.session.set("user", null);

  response.redirect("/auth/login");
};

const showLoginForm = ({ render, user, response }) => {
  if (!user) {
    render("login.eta");
  } else {
    response.redirect("/topics");
  }
};

export { login, logout, showLoginForm };
