const nodemailer = require("nodemailer");

transporter = nodemailer.createTransport({
  service: "drivingsolution.ng",
  port: process.env.MAILER_PORT,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASS,
  },
})

var welcomMail = {
  from: "Wosiwosi Money",
  to: "odunlamibamidelejohn@gmail.com",
  subject: "Welcome to Wosiwosi Money",
  text: "Hey there, welcome to wosiwosi money mailer test",
};

const sendWelcome = transporter.sendMail(welcomMail, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});

module.exports = {
  sendWelcome: sendWelcome,
};
