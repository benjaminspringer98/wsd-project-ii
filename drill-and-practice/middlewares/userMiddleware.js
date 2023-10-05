import * as userService from "../services/userService.js";

const userMiddleware = async (context, next) => {
  const sessionUser = await context.state.session.get("user");

  if (sessionUser) {
    const userFromDatabase = await userService.findByEmail(sessionUser.email);
    const user = userFromDatabase[0];

    //shouldn't store password in context, even if hashed
    context.user = { id: user.id, email: user.email, isAdmin: user.admin };
  }

  await next();
};

export { userMiddleware };
