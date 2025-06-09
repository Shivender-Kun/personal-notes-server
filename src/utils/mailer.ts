import { readFileSync } from "fs";
import nodemailer from "nodemailer";
import path from "path";

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

export const sendResetMail = async (
  to: string,
  username: string,
  token: string
) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "emails",
    "templates",
    "resetPassword.html"
  );
  let html = readFileSync(templatePath, "utf8");

  const resetLink = `https://notes.shivender.pro/reset-password/${token}`;

  html = html
    .replace("{{username}}", username)
    .replace("{{resetLink}}", resetLink);

  try {
    const info = await transport.sendMail({
      from: `"Support" <${process.env.SUPPORT_EMAIL}>`,
      to,
      subject: "Reset Your Password - Personal Notes",
      html,
    });

    console.log("Mail Information", info);

    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error for further handling
  }
};
