const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.from
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.text
 */
const sendEmail = ({ from, to, subject, text }) => {
  const mailOptions = {
    from,
    to, // <-- dynamic recipient
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
