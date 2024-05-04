import httpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import Jimp from "jimp";
import gravatar from "gravatar";
import path from "path";
import { User } from "../models/AuthModel.js";
dotenv.config();
const { SECRET } = process.env;
const avatarpath = path.join(process.cwd(), "public", "avatars");
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw httpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL: avatarUrl,
    });
    res.status(201).json({
      email: newUser.email,
      password,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw httpError(401, "Email or password is incorrect");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw httpError(401, "Email or password is incorrect");
    }
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1w" });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
export const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;

  const { path: tempUpload, originalname } = req.file;

  const avatarImage = await Jimp.read(tempUpload);

  await avatarImage.resize(250, 250);

  const filname = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarpath, filname);

  await fs.rename(tempUpload, resultUpload);

  const avatarUrl = path.join("avatars", filname);

  await User.findByIdAndUpdate(_id, { avatarURL: avatarUrl });

  res.json({ avatarURL: avatarUrl });
};
