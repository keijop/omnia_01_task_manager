'use strict'
//	rquirements:
// 	npm install nodemailer
// 	npm install dotenv

const nodemailer = require('nodemailer')

//	keep secrets in .env file
//	use process.env.USERNAME
//	use process.env.PASSWORD
const username = process.env.MAIL_USERNAME
const password = process.env.MAIL_PASSWORD

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async obj => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  })

  // send mail with transport object
  let info = await transporter.sendMail({
    from: obj.from, //' "Task manager" <webTesting@mail.com>', // sender address
    to: obj.to, //"pruntk@gmail.com, baz@example.com", // list of receivers
    subject: obj.subject, //"Hello", // Subject line
    text: obj.text, //"Hello world?", // plain text body
    html: obj.html, //'<b>Hello world in bold!</b>'  // html body
  })

  console.log('Message sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

//main().catch(console.error)

module.exports = sendEmail
