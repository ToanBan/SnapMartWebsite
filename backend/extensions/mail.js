const nodemailer = require("nodemailer");

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("EMAIL:", process.env.APP_USER_EMAIL);
console.log("PASS:", process.env.APP_PASSWORD ? "OK" : "MISSING");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // ví dụ: smtp.gmail.com
  port: 587,
  secure: false, // true nếu port 465
  auth: {
    user: process.env.APP_USER_EMAIL, // email gửi
    pass: process.env.APP_PASSWORD, // app password
  },
  connectionTimeout: 10000, // tránh timeout khi deploy
});

async function sendMail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `SnapMart <${process.env.APP_USER_EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Send mail failed:", error);
    throw error;
  }
}

module.exports = sendMail;
