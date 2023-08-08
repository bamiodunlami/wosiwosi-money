const appRoot = require ('app-root-path')
const path = require ('path')
const rootPath = path.resolve(process.cwd())
appRoot.setPath(rootPath)

const mailTemp = require (appRoot + "/util/mailTemplate.js")
const welcomeTemp = mailTemp.welcome
const idApproveMail = mailTemp.idApprove
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: process.env.MAILER_PORT,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASS,
  },
})

const welcomeMail = (to, name) => {
  const mailOptions = {
      from: 'info@wosiwosi.co.uk',
      to: to,
      subject: "Welcome to Wosiwosi Money",
      html: welcomeTemp
  };

  transporter.sendMail(mailOptions);
};

const idApprove = (to,) => {
  const mailOptions = {
      from: 'info@wosiwosi.co.uk',
      to: to,
      subject: "Welcome to Wosiwosi Money",
      html: idApproveMail
  };

  transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcome: welcomeMail,
  sendApprove: idApprove
};
