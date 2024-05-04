import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const {
  transport_host,
  transport_port,
  transport_auth_user,
  transport_auth_pass,
} = process.env;
const sentEmail = {
  host: transport_host,
  port: transport_port,
  auth: {
    user: transport_auth_user,
    pass: transport_auth_pass,
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
