import express from "express";
import {
  getCurrent,
  login,
  logout,
  register,
} from "../controllers/authcontroler.js";
import validateBody from "../helpers/validateBody.js";
import { loginForm, registerForm } from "../schemas/usersSchemas.js";
import authenticate from "../helpers/Authorization.js";

const usersRouter = express.Router();
usersRouter.post("/register", validateBody(registerForm), register);
usersRouter.post("/login", validateBody(loginForm), login);
usersRouter.post("/logout", authenticate, logout);
usersRouter.get("/current", authenticate, getCurrent);
export default usersRouter;
