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

// quick Receive notification
const quickReceiveNotification = (to, userName) =>{
  option = {
    from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
    to:to,
    subject: "Your NGN to GBP transfer form",
    html:
    `
    <!DOCTYPE html>
    <html>
    <head>
       <title>NGN to GBP Transfer form submitted</title>
    </head>
    <body style="font-family: Poppings, sans-serif;">
    
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
           <tr>
               <td>
                   <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                       <tr>
                           <td style="padding: 40px;">
                               <h3 style="color: #333;">Dear ${userName} your NGN to GBP transfer form has been submitted</h3>
                               <p style="color: #666;">Thank you for using this service, we will process your transfer soon.</p>
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


// quick Receive notification
const adminQuickReceiveNotification = (to, userName, fname, lname, address, postcode, phone, email, ukBank, ukAccount, ukSort, ukBankName, description, bvn,idLink) =>{
    option = {
    from: '"Wosiwosi Money" <info@wosiwosi.co.uk>',
    to:to,
    subject: "NGN TO GBP Transfer Form",
    html:
    `
    <!DOCTYPE html>
    <html>
    <head>
       <title>NGN to GBP Transfer form submitted</title>
    </head>
    <body style="font-family: Poppings, sans-serif;">
    
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
           <tr>
               <td>
                   <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                       <tr>
                           <td style="padding: 40px;">
                               <h3 style="color: #333;">${userName} submitted NGN to GBP transfer form</h3>
                               <p style="color: #666;">Here are the details filled in:</p>
                               <p>First Name: ${fname}</p>
                               <p>Last Name: ${lname}</p>
                               <p>Address: ${address}</p>
                               <p>Postcode: ${postcode}</p>
                               <p>Phone: ${phone}</p>
                               <p>Email: ${email}</p>
                               <p>UK Bank: ${ukBank}</p>
                               <p>UK Account Number: ${ukAccount}</p>
                               <p>UK Account Sort-code: ${ukSort}</p>
                               <p>UK Name on Bank: ${ukBankName}</p>
                               <p>Transfer description: ${description}</p>
                               <p>BVN: ${bvn}</p>
                               <p>Identification Link: ${idLink}</p>
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


module.exports = {
  sendWelcome: welcomeMail,
  sendApprove: idApprove,
  sendFxNotification:notificationOfExchange,
  quickReceive:quickReceiveNotification,
  adminQuickReceive:adminQuickReceiveNotification
};
