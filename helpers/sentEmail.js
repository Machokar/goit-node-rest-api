import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const { transportHost, transportPort, transportAuthUser, transportAuthPass } =
  process.env;
const sentEmail = {
  host: transportHost,
  port: transportPort,
  auth: {
    user: transportAuthUser,
    pass: transportAuthPass,
  },
};
const transporter = nodemailer.createTransport(sentEmail);

export const sendEmail = async (data) => {
  const email = {
    ...data,
    from: "m.kasin@gmail.com",
  };
  await transporter.sendMail(email);
  return true;
};
