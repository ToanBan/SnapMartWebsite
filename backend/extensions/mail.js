const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail(to, subject, text) {
  return resend.emails.send({
    from: `${process.env.APP_USER}`,
    to,
    subject,
    text,
  });
}

module.exports = sendMail;
