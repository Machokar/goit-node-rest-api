import httpError from "./HttpError.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/AuthModel.js";

dotenv.config();
const { SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw httpError(401);
  }
  try {
    const { id } = jwt.verify(token, SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      throw httpError(401);
    }
    req.user = user;
    next();
  } catch {
    throw httpError(401);
  }
};
export default authenticate;
