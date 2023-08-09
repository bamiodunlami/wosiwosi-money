const welcomMail = 
  `<!DOCTYPE html>
  <html>
  <head>
      <title>Welcome to Wosiwosi Money</title>
  </head>
  <body style="font-family: Poppings, sans-serif;">
  
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
          <tr>
              <td align="center">
                  <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                      <tr>
                          <td align="center" style="padding: 40px;">
                              <h3 style="color: #333;">Welcome to Wosiwosi Money!</h3>
                              <p style="color: #666;">We're delighted to have you join our global money transfer community.</p>
                              <p style="color: #666;">At Wosiwosi Money, we're here to make your cross-border financial transactions effortless. Whether you're sending Pounds to your loved ones in West African countries or converting local currency to Pounds, we've got you covered.</p>
                              <p style="color: #666;">Our goal is to provide you with a secure, fast, and reliable money transfer experience. With competitive exchange rates and a user-friendly app, managing your international finances has never been easier.</p>
                              <p style="color: #666;">Feel free to explore the app, initiate transfers, and discover the convenience of Wosiwosi Money. If you have any questions or need assistance, our support team is just a message away.</p>
                              <p style="color: #666;">Welcome aboard and thank you for choosing Wosiwosi Money!</p>
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

 const idApproveMail = 
 `
 <!DOCTYPE html>
<html>
<head>
    <title>Identity Verification Successful</title>
</head>
<body style="font-family: Popping, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="padding: 40px;">
                            <h3 style="color: #333;">Identity Verification Successful</h3>
                            <p style="color: #666;">We're pleased to inform you that your identity verification has been successfully completed.</p>
                            <p style="color: #666;">You can now enjoy the full benefits of our platform and start making secure transactions. Whether you're sending money, managing your account, or exploring our services, your verified identity adds an extra layer of security to your experience.</p>
                            <p style="color: #666;">If you have any questions or need assistance, please don't hesitate to reach out to our support team. We're here to help you have a smooth and secure experience.</p>
                            <p style="color: #666;">Thank you for choosing [Your Platform Name] for your financial needs. We look forward to serving you!</p>
                            <p style="color: #999;">Best regards,</p>
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

module.exports ={
    welcome:welcomMail,
    idApprove:idApproveMail
}