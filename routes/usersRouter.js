import express from "express";
import { register } from "../controllers/UsersController";

const usersRouter = express.Router();
usersRouter.post("/register", register);
usersRouter.post("/login");
usersRouter.post("/logout");
usersRouter.get("/current");
export default usersRouter;
