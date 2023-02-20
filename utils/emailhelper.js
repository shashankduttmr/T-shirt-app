const nodemailer = require("nodemailer");

const mailHelper = async function(options){
    const  transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER, // generated ethereal user
          pass: process.env.SMTP_PASS, // generated ethereal password
        },
      });
    
      let message = {
        from: 'shashank@shashankdutt.in', // sender address
        to: options.toEmail, // list of receivers
        subject: options.Subject, // Subject line
        text: options.message, // plain text body
        // html: "<a>Hello world?</a>", // html body
      }
      // send mail with defined transport object
        await transporter.sendMail(message);
}


module.exports = mailHelper