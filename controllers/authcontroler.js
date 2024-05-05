import httpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import Jimp from "jimp";
import gravatar from "gravatar";
import path from "path";
import { User } from "../models/AuthModel.js";
import { nanoid } from "nanoid";
import { sendEmail } from "../helpers/sentEmail.js";
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
    const verificationToken = nanoid();
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL: avatarUrl,
      verificationToken,
    });
    const verifyEmail = {
      to: email,
      subject: "Email verification",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click to verify your email</a>`,
      text: "Click to verify your email",
    };
    await sendEmail(verifyEmail);
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
    if (!user.verify) {
      throw httpError(404, "Email not verified");
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
export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const token = await User.findOne({ verificationToken });
    if (!token) {
      throw httpError(404, "User not found");
    }
    await User.findByIdAndUpdate(token._id, {
      verify: true,
      verificationToken: "",
    });
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};
export const resentEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      throw httpError(404, "Email is not found");
    }
    if (userEmail.verify) {
      throw httpError(404, "Verification has already been passed");
    }
    const verifyEmail = {
      to: email,
      subject: "Email verification",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${userEmail.verificationToken}">Click to verify your email</a>`,
      text: "Click to verify your email",
    };
    await sendEmail(verifyEmail);
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
