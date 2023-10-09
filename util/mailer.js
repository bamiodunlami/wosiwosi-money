const appRoot = require ('app-root-path')
const path = require ('path')
const rootPath = path.resolve(process.cwd())
appRoot.setPath(rootPath)

const mailTemp = require (appRoot + "/util/mailTemplate.js")
const welcomeTemp = mailTemp.welcome
const idApproveMail = mailTemp.idApprove
// const transactionNotification = mailTemp.fxNotification
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

const welcomeMail = (to) => {
  const mailOptions = {
      from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
      to: to,
      subject: "Welcome to Wosiwosi Money",
      html: welcomeTemp
  };

  transporter.sendMail(mailOptions);
};

const idApprove = (to) => {
  const mailOptions = {
      from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
      to: to,
      subject: "Welcome to Wosiwosi Money",
      html: idApproveMail
  };
  transporter.sendMail(mailOptions);
};

const notificationOfExchange = (to, transactionStatus, userName, id, date, sendAmount, rate, receiveAmount, receiver)=>{
  mailOptions = {
    from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
    to:to,
    subject: "Your transaction",
    html: `<!DOCTYPE html>
    <html>
    <head>
        <title>Transaction Successful</title>
    </head>
    <body style="font-family: Poppings, sans-serif;">
    
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
            <tr>
                <td align="center">
                    <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td style="padding: 40px;">
                                <h3 style="color: #333;">Transaction ${transactionStatus}</h3>
                                <p style="color: #666;">Hello ${userName},</p>
                                <p style="color: #666;">Here is the details of your recent transaction.</p>
                                <p style="color: #666;">Transaction Details:</p>
                                    <h4><strong>Transaction ID:</strong> ${id}</h4>
                                    <h4> <strong>Date:</strong> ${date} </h4>
                                    <h4> <strong>Amount:</strong> £${sendAmount/100} </h4> 
                                    <h4> <strong>Exchange Rate:</strong> ${rate}</h4>
                                    <h4> <strong>Amount Received:</strong> ${receiveAmount}</h4>
                                    <h4> <strong>Recipient:</strong> ${receiver}</h4>
                                <p style="color: #666;">Thank you for choosing Wosiwosi Money for your financial transactions. If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                                <p style="color: #999;">Best regards,</p>
                                <p style="color: #999;">The Wosiwosi Money Team</p>
                            </td>
                        </tr>
                        <tr>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    
    </body>
    </html>
    `
  }
  transporter.sendMail(mailOptions);
}

const adminfxnotification = (to, transactionStatus, userName, id, date, sendAmount, rate, receiveAmount, receiver)=>{
    mailOptions = {
      from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
      to:to,
      subject: "Your transaction",
      html: `<!DOCTYPE html>
      <html>
      <head>
          <title>Transaction Successful</title>
      </head>
      <body style="font-family: Poppings, sans-serif;">
      
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
              <tr>
                  <td align="center">
                      <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                          <tr>
                              <td style="padding: 40px;">
                                  <h3 style="color: #333;">Transaction ${transactionStatus}</h3>
                                  <p style="color: #666;">GBP to NGN transaction made by ${userName}</p>
                                  <p style="color: #666;">Transaction Details:</p>
                                      <h4><strong>Transaction ID:</strong> ${id}</h4>
                                      <h4> <strong>Date:</strong> ${date} </h4>
                                      <h4> <strong>Amount:</strong> £${sendAmount/100} </h4> 
                                      <h4> <strong>Exchange Rate:</strong> ${rate}</h4>
                                      <h4> <strong>Amount Received:</strong> ${receiveAmount}</h4>
                                      <h4> <strong>Recipient:</strong> ${receiver}</h4>
                                  <p style="color: #999;">Best regards,</p>
                                  <p style="color: #999;">The Wosiwosi Money Team</p>
                              </td>
                          </tr>
                          <tr>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      
      </body>
      </html>
      `
    }
    transporter.sendMail(mailOptions);
  }

// quick Receive notification
const receiveFail = (to, userName, id) =>{
  option = {
    from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
    to:to,
    subject: "Your NGN to GBP failed",
    html:
    `
    <!DOCTYPE html>
    <html>
    <head>
       <title>NGN to GBP Transfer failed</title>
    </head>
    <body style="font-family: Poppings, sans-serif;">
    
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
           <tr>
               <td>
                   <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                       <tr>
                           <td style="padding: 40px;">
                               <h3 style="color: #333;">Dear ${userName} your NGN to GBP transfer failed</h3>
                               <p style="color: #666;">Transaction:</p>
                               <h4><strong>Transaction ID:</strong> ${id}</h4>
                               <p style="color: #999;">Wosiwosi Money Team</p>
                           </td>
                       </tr>
                       <tr>
                       </tr>
                   </table>
               </td>
           </tr>
       </table>
    
    </body>
    </html>
    
    ` 

  }
  transporter.sendMail(option)
}


// Admin quick Receive notification
const receiveSuccessAdmin = (to, fname, lname, id, txId) =>{
    option = {
    from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
    to:to,
    subject: "NGN TO GBP Request",
    html:
    `
    <!DOCTYPE html>
    <html>
    <head>
       <title>NGN to GBP Transfer request</title>
    </head>
    <body style="font-family: Poppings, sans-serif;">
    
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
           <tr>
               <td>
                   <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                       <tr>
                           <td style="padding: 40px;">
                               <h3 style="color: #333;">${fname} has successfully made a payment for NGN to GBP transaction</h3>
                               <p style="color: #666;">Details:</p>
                               <p>First Name: ${fname}</p>
                               <p>Last Name: ${lname}</p>
                               <p>BVN/Passport ID: ${id}</p>
                               <p>Transaction ID: ${txId}</p>
                               <p style="color: #999;">Wosiwosi Money Team</p>
                           </td>
                       </tr>
                       <tr>
                       </tr>
                   </table>
               </td>
           </tr>
       </table>
    
    </body>
    </html>
    
    ` 

  }
  transporter.sendMail(option)
}

const receiveSuccess = (to, fname, txId) =>{
    option = {
    from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
    to:to,
    subject: "Payment received",
    html:
    `
    <!DOCTYPE html>
    <html>
    <head>
       <title>Payment received</title>
    </head>
    <body style="font-family: Poppings, sans-serif;">
    
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
           <tr>
               <td>
                   <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                       <tr>
                           <td style="padding: 40px;">
                               <h3 style="color: #333;">Dear ${fname} your NGN to GBP payment received.</h3>
                               <p style="color: #666;">Details:</p>
                               <p>Transaction ID: ${txId}</p>
                               <h3 style="color: #333;">Transfer process has now been initiated</h3>
                               <p style="color: #999;">Wosiwosi Money Team</p>
                           </td>
                       </tr>
                       <tr>
                       </tr>
                   </table>
               </td>
           </tr>
       </table>
    
    </body>
    </html>
    
    ` 

  }
  transporter.sendMail(option)
}

// Reset password
const resetLink = (to, link) =>{
    option = {
    from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
    to:to,
    subject: "Password reset",
    html:
    `
    <!DOCTYPE html>
    <html>
    <head>
       <title>Password reset</title>
    </head>
    <body style="font-family: Poppings, sans-serif;">
    
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
           <tr>
               <td>
                   <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                       <tr>
                           <td style="padding: 40px;">
                               <h3 style="color: #333;">You requested a password reset</h3>
                               <p>Hello, you have requested to reset you Wosiwosi Money password.</p>
                               <p>Click the below link to reset your password now</p>
                               <p>${link}</p>
                               <p>If this is not from you, kindly ignore this email.</p>
                               <p>Cheers,</p>
                               <p style="color: #999;">Wosiwosi Money Team</p>
                           </td>
                       </tr>
                       <tr>
                       </tr>
                   </table>
               </td>
           </tr>
       </table>
    
    </body>
    </html>
    
    ` 

  }
  transporter.sendMail(option)
}

// mail verification
const emailConfirmation = (to, link) =>{
    option = {
    from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
    to:to,
    subject: "Email confirmation",
    html:
    `
    <!DOCTYPE html>
    <html>
    <head>
       <title>Email Confirmation</title>
    </head>
    <body style="font-family: Poppings, sans-serif;">
    
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
           <tr>
               <td>
                   <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                       <tr>
                           <td style="padding: 40px;">
                               <h3 style="color: #333;">Confirm it's your email</h3>
                               <p>Hello, before anything, we'd like you to confirm the email submitted to us is yours</p>
                               <p>Click the below to confirm your email</p>
                               <a href="${link}">Verify email</a>
                               <p>If this is not from you, kindly ignore this email.</p>
                               <p>Cheers,</p>
                               <p style="color: #999;">Wosiwosi Money Team</p>
                           </td>
                       </tr>
                       <tr>
                       </tr>
                   </table>
               </td>
           </tr>
       </table>
    
    </body>
    </html>
    
    ` 

  }
  transporter.sendMail(option)
}

// Reset password
const sendIdentity = (to, fname) =>{
    option = {
    from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
    to:to,
    subject: "Verification needed",
    html:
    `
    <!DOCTYPE html>
    <html>
    <head>
       <title>Verification needed</title>
    </head>
    <body style="font-family: Poppings, sans-serif;">
    
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
           <tr>
               <td>
                   <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                       <tr>
                           <td style="padding: 40px;">
                               <h3>Dear ${fname} we are currently working on your transfer but according to the UK law and money laundry regulation, we are require to get the followings from you before the final state of the GBP transfer</h3>
                               <h3>Your Nigeria BVN</h3>
                               <h3>A valid ID (Passport, Driving lisence or BRP)</h3>
                               <h3>A proof of address (Utility bill, local tax bill)</h3>
                               <h3>Kindly reply to this email with the requested document or reply to media@wosiwosi.co.uk to help us speed up your transfer.</h3>
                               <p>Cheers,</p>
                               <p style="color: #999;">Wosiwosi Money Team</p>
                           </td>
                       </tr>
                       <tr>
                       </tr>
                   </table>
               </td>
           </tr>
       </table>
    
    </body>
    </html>
    
    ` 

  }
  transporter.sendMail(option)
}

// Reset password
const sendeMail = (to, subject, fname, body) =>{
    option = {
    from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
    to:to,
    subject: subject,
    html:
    `
    <!DOCTYPE html>
    <html>
    <head>
       <title>${subject}</title>
    </head>
    <body style="font-family: Poppings, sans-serif;">
    
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
           <tr>
               <td>
                   <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                       <tr>
                           <td style="padding: 40px;">
                               <h4>Hi ${fname},</h4>
                               <p>${body}</p>
                               <br>
                               <p>Cheers,</p>
                               <p>Wosiwosi Money Team</p>
                           </td>
                       </tr>
                       <tr>
                       </tr>
                   </table>
               </td>
           </tr>
       </table>
    
    </body>
    </html>
    
    ` 

  }
  transporter.sendMail(option)
}

module.exports = {
  sendWelcome: welcomeMail,
  sendApprove: idApprove,
  sendFxNotification:notificationOfExchange,
  adminfxnotification:adminfxnotification,
  receiveFail:receiveFail,
  receiveSuccessAdmin:receiveSuccessAdmin,
  receiveSuccess:receiveSuccess,
  resetMail:resetLink,
  emailVerification: emailConfirmation,
  sendIdentity:sendIdentity,
  sendeMail:sendeMail
};
