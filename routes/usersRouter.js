import express from "express";
import {
  getCurrent,
  login,
  logout,
  register,
  resentEmail,
  updateAvatar,
  verifyEmail,
} from "../controllers/authcontroler.js";
import validateBody from "../helpers/validateBody.js";
import { emailForm, loginForm, registerForm } from "../schemas/usersSchemas.js";
import authenticate from "../helpers/Authorization.js";
import update from "../helpers/update.js";

const usersRouter = express.Router();
usersRouter.post("/register", validateBody(registerForm), register);
usersRouter.post("/login", validateBody(loginForm), login);
usersRouter.post("/logout", authenticate, logout);
usersRouter.get("/current", authenticate, getCurrent);
usersRouter.get("/verify/:verificationToken", verifyEmail);
usersRouter.post("/verify", validateBody(emailForm), resentEmail);
usersRouter.patch(
  "/avatars",
  authenticate,
  update.single("avatar"),
  updateAvatar
);
export default usersRouter;
