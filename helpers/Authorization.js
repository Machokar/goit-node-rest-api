import jwt from "jsonwebtoken";
import httpError from "../helpers/HttpError.js";
import { User } from "../models/AuthModel.js";

const { SECRET } = process.env;

const authenticate = async (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw httpError(401, "Not authorized");
  }
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw httpError(401, "Bearer not found");
  }
  try {
    const { id } = jwt.verify(token, SECRET);

    const user = await User.findOne({ _id: id });

    if (!user) {
      throw httpError(401, "User not found");
    }
    if (!user.token) {
      throw httpError(401, "User already signout");
    }
    req.user = user;
    next();
  } catch (error) {
    next(httpError(401, error.message));
  }
};

export default authenticate;
